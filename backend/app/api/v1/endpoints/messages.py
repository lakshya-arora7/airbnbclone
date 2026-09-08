from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc

from app.db.session import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.message import Message
from app.models.notification import Notification
from app.schemas.message import MessageCreate, MessageResponse, ThreadResponse, ThreadParticipant, ThreadListing
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def format_relative_time(dt: datetime) -> str:
    if not dt:
        return ""
    now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    diff = now - dt
    if diff.total_seconds() < 60:
        return "Just now"
    if diff.total_seconds() < 3600:
        mins = int(diff.total_seconds() / 60)
        return f"{mins}m ago"
    if diff.total_seconds() < 86400:
        return dt.strftime("%I:%M %p").lstrip("0")
    if diff.days == 1:
        return "Yesterday"
    return dt.strftime("%d/%m")

@router.get("/threads", response_model=List[ThreadResponse])
def get_user_threads(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    all_msgs = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    ).order_by(Message.created_at.asc()).all()

    # Group messages by (other_user_id, listing_id)
    threads_map: Dict[str, List[Message]] = {}
    other_users_cache: Dict[int, User] = {}
    listings_cache: Dict[int, Optional[Listing]] = {}

    for msg in all_msgs:
        other_id = msg.recipient_id if msg.sender_id == current_user.id else msg.sender_id
        listing_key = msg.listing_id or 0
        thread_key = f"{other_id}_{listing_key}"
        if thread_key not in threads_map:
            threads_map[thread_key] = []
        threads_map[thread_key].append(msg)

    result: List[ThreadResponse] = []
    for thread_key, msgs in threads_map.items():
        other_id_str, listing_id_str = thread_key.split("_")
        other_id = int(other_id_str)
        listing_id = int(listing_id_str) if listing_id_str != "0" else None

        if other_id not in other_users_cache:
            other_users_cache[other_id] = db.query(User).filter(User.id == other_id).first()
        other_user = other_users_cache[other_id]
        if not other_user:
            continue

        thread_listing: Optional[ThreadListing] = None
        if listing_id:
            if listing_id not in listings_cache:
                listings_cache[listing_id] = db.query(Listing).filter(Listing.id == listing_id).first()
            lst = listings_cache[listing_id]
            if lst:
                primary_img = None
                if lst.images:
                    primary_img = next((img.url for img in lst.images if img.is_primary), lst.images[0].url)
                thread_listing = ThreadListing(
                    id=lst.id,
                    title=lst.title,
                    city=lst.city,
                    country=lst.country,
                    image_url=primary_img,
                    price_per_night=lst.price_per_night
                )

        unread_count = sum(1 for m in msgs if m.recipient_id == current_user.id and not m.is_read)
        last_msg = msgs[-1] if msgs else None

        serialized_msgs = []
        for m in msgs:
            is_me = m.sender_id == current_user.id
            sender_obj = current_user if is_me else other_user
            serialized_msgs.append({
                "id": m.id,
                "sender": "guest" if sender_obj.role.upper() == "GUEST" else "host",
                "sender_id": m.sender_id,
                "sender_name": "You" if is_me else sender_obj.full_name,
                "sender_avatar": sender_obj.avatar_url,
                "text": m.text,
                "time": format_relative_time(m.created_at),
                "created_at": m.created_at.isoformat() if m.created_at else None,
                "is_read": m.is_read
            })

        result.append(ThreadResponse(
            thread_id=thread_key,
            other_user=ThreadParticipant(
                id=other_user.id,
                full_name=other_user.full_name,
                avatar_url=other_user.avatar_url,
                role=other_user.role,
                is_superhost=other_user.is_superhost
            ),
            listing=thread_listing,
            last_message=last_msg.text if last_msg else None,
            last_message_date=format_relative_time(last_msg.created_at) if last_msg else None,
            unread_count=unread_count,
            messages=serialized_msgs
        ))

    # Sort threads with most recent message first
    result.sort(
        key=lambda t: t.messages[-1]["created_at"] if t.messages and t.messages[-1].get("created_at") else "",
        reverse=True
    )
    return result

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipient = db.query(User).filter(User.id == payload.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient user not found.")

    listing = None
    if payload.listing_id:
        listing = db.query(Listing).filter(Listing.id == payload.listing_id).first()

    msg = Message(
        sender_id=current_user.id,
        recipient_id=payload.recipient_id,
        listing_id=payload.listing_id,
        text=payload.text.strip(),
        is_read=False
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Automatically notify recipient
    preview_text = payload.text.strip()
    if len(preview_text) > 75:
        preview_text = preview_text[:72] + "..."

    listing_context = f" regarding '{listing.title}'" if listing else ""
    notif = Notification(
        user_id=payload.recipient_id,
        type="message",
        title=f"New message from {current_user.full_name}",
        description=f"{preview_text}{listing_context}",
        link_url="/messages" if recipient.role.upper() == "GUEST" else "/hosting",
        is_read=False
    )
    db.add(notif)
    db.commit()

    return MessageResponse(
        id=msg.id,
        sender_id=msg.sender_id,
        recipient_id=msg.recipient_id,
        listing_id=msg.listing_id,
        text=msg.text,
        is_read=msg.is_read,
        created_at=msg.created_at,
        sender_name=current_user.full_name,
        sender_avatar=current_user.avatar_url
    )

@router.post("/thread/{thread_id}/read")
def mark_thread_as_read(
    thread_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        parts = thread_id.split("_")
        target_id = int(parts[0])
        listing_id = int(parts[1]) if len(parts) > 1 and parts[1] != "0" else None
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid thread ID format.")

    query = db.query(Message).filter(
        Message.recipient_id == current_user.id,
        Message.is_read == False
    )
    if target_id != current_user.id:
        query = query.filter(Message.sender_id == target_id)
    if listing_id:
        query = query.filter(Message.listing_id == listing_id)

    updated_count = query.update({"is_read": True})
    db.commit()
    return {"updated": updated_count}

@router.delete("/thread/{thread_id}")
def delete_thread(
    thread_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        other_id_str, listing_id_str = thread_id.split("_")
        other_id = int(other_id_str)
        listing_id = int(listing_id_str) if listing_id_str != "0" else None
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid thread ID format.")

    query = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == other_id),
            and_(Message.sender_id == other_id, Message.recipient_id == current_user.id)
        )
    )
    if listing_id:
        query = query.filter(Message.listing_id == listing_id)

    deleted_count = query.delete(synchronize_session=False)
    db.commit()
    return {"deleted": deleted_count}

@router.delete("")
def clear_user_messages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted_count = db.query(Message).filter(
        or_(Message.sender_id == current_user.id, Message.recipient_id == current_user.id)
    ).delete(synchronize_session=False)
    db.commit()
    return {"deleted": deleted_count}

