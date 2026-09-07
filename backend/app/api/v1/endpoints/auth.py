from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, PersonaSwitchRequest, AuthLoginRequest

router = APIRouter()

# Active persona storage in-memory for development
ACTIVE_USER_ID = 1

def get_current_user(
    x_user_id: int = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db)
) -> User:
    global ACTIVE_USER_ID
    uid = x_user_id if x_user_id is not None else ACTIVE_USER_ID
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        # Fallback to first user
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user found. Please run seed script.")
    return user

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=List[UserResponse])
def list_available_personas(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/switch-persona", response_model=UserResponse)
def switch_active_persona(payload: PersonaSwitchRequest, db: Session = Depends(get_db)):
    global ACTIVE_USER_ID
    target_role = payload.role.upper()
    user = db.query(User).filter(User.role == target_role).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No user with role {target_role} found.")
    
    ACTIVE_USER_ID = user.id
    return user

@router.post("/login", response_model=UserResponse)
def login_or_signup(payload: AuthLoginRequest, db: Session = Depends(get_db)):
    global ACTIVE_USER_ID
    target_role = payload.role.upper()
    login_val = (payload.login_id or "").strip()
    
    # 1. Check by email if entered
    user = None
    if "@" in login_val:
        user = db.query(User).filter(User.email.ilike(login_val)).first()
    
    # 2. If matching user found with role or switch role if requested
    if user:
        ACTIVE_USER_ID = user.id
        return user

    # 3. Check if any seeded user exists with matching role
    user = db.query(User).filter(User.role == target_role).first()
    if user and not login_val:
        ACTIVE_USER_ID = user.id
        return user

    # 4. Create new user for this Guest or Host persona
    clean_email = login_val if "@" in login_val else f"{login_val.replace('+', '').replace(' ', '') or 'user'}@airbnb.demo"
    default_name = payload.full_name or ("Host Partner" if target_role == "HOST" else "Traveler Guest")
    
    new_user = User(
        email=clean_email,
        full_name=default_name,
        role=target_role,
        is_superhost=(target_role == "HOST"),
        host_since="September 2026",
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    ACTIVE_USER_ID = new_user.id
    return new_user

@router.post("/select-user/{user_id}", response_model=UserResponse)
def select_user_by_id(user_id: int, db: Session = Depends(get_db)):
    global ACTIVE_USER_ID
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found.")
    ACTIVE_USER_ID = user.id
    return user
