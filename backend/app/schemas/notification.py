from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    type: str
    title: str
    description: str
    link_url: str
    is_read: bool
    time: Optional[str] = None
    created_at: datetime
