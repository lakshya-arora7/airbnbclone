from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.db.repository.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_role(self, role: str) -> List[User]:
        return self.db.query(User).filter(User.role == role.upper()).all()

    def set_superhost(self, user_id: int, is_superhost: bool) -> Optional[User]:
        user = self.get(user_id)
        if user:
            user.is_superhost = is_superhost
            self.db.flush()
        return user
