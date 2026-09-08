from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class MessageCreate(BaseModel):
    recipient_id: int
    listing_id: Optional[int] = None
    text: str

class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    recipient_id: int
    listing_id: Optional[int] = None
    text: str
    is_read: bool
    created_at: datetime
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None

class ThreadParticipant(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str] = None
    role: str
    is_superhost: bool = False

class ThreadListing(BaseModel):
    id: int
    title: str
    city: str
    country: str
    image_url: Optional[str] = None
    price_per_night: float

class ThreadResponse(BaseModel):
    thread_id: str
    other_user: ThreadParticipant
    listing: Optional[ThreadListing] = None
    last_message: Optional[str] = None
    last_message_date: Optional[str] = None
    unread_count: int = 0
    messages: List[Dict[str, Any]] = []
