from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.api.v1.endpoints.auth import get_current_user
from app.api.v1.endpoints.messages import format_relative_time

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()

    return [
        NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            type=n.type,
            title=n.title,
            description=n.description,
            link_url=n.link_url,
            is_read=n.is_read,
            time=format_relative_time(n.created_at),
            created_at=n.created_at
        )
        for n in notifs
    ]

@router.post("/{id}/read")
def mark_notification_as_read(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")
    notif.is_read = True
    db.commit()
    return {"status": "success", "id": id}

@router.post("/read-all")
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"marked_read": count}

@router.delete("")
def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).delete()
    db.commit()
    return {"deleted": deleted}
