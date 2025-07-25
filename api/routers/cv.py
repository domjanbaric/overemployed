import os
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db, get_current_user

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter(prefix="/cv", tags=["cv"])


@router.post("/upload", response_model=schemas.CVDetail)
def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid4()}{ext}"
    path = UPLOAD_DIR / filename
    with path.open("wb") as f:
        f.write(file.file.read())
    cv = models.CV(
        user_id=current_user.id, filename=filename, status=models.CVStatus.pending
    )
    db.add(cv)
    db.commit()
    db.refresh(cv)
    return cv


@router.get("/{cv_id}", response_model=schemas.CVDetail)
def get_cv(
    cv_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cv = (
        db.query(models.CV)
        .filter(models.CV.id == cv_id, models.CV.user_id == current_user.id)
        .first()
    )
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    return cv


@router.get("/list", response_model=list[schemas.CVPreview])
def list_cvs(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    cvs = db.query(models.CV).filter(models.CV.user_id == current_user.id).all()
    return cvs
