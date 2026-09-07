import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.core.config import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}

@router.post("")
async def upload_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    destination = os.path.join(settings.UPLOAD_DIR, unique_filename)

    async with aiofiles.open(destination, "wb") as buffer:
        content = await file.read()
        await buffer.write(content)

    return {
        "filename": unique_filename,
        "url": f"/static/uploads/{unique_filename}"
    }
