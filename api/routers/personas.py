from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/personas", tags=["personas"])


@router.get("", response_model=list[schemas.PersonaOut])
def list_personas(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Persona).filter(models.Persona.user_id == current_user.id).all()
    )


@router.post("", response_model=schemas.PersonaOut)
def create_persona(
    data: schemas.PersonaCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona = models.Persona(
        user_id=current_user.id,
        title=data.title,
        summary=data.summary,
        tags=data.tags,
        data=data.overrides,
        base_cv_id=data.base_cv_id,
    )
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona


@router.get("/{persona_id}", response_model=schemas.PersonaOut)
def get_persona(
    persona_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona = (
        db.query(models.Persona)
        .filter(
            models.Persona.id == persona_id, models.Persona.user_id == current_user.id
        )
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona


@router.patch("/{persona_id}", response_model=schemas.PersonaOut)
def update_persona(
    persona_id: str,
    data: schemas.PersonaCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona = (
        db.query(models.Persona)
        .filter(
            models.Persona.id == persona_id, models.Persona.user_id == current_user.id
        )
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(persona, field, value)
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona


@router.delete("/{persona_id}")
def delete_persona(
    persona_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona = (
        db.query(models.Persona)
        .filter(
            models.Persona.id == persona_id, models.Persona.user_id == current_user.id
        )
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    db.delete(persona)
    db.commit()
    return {"status": "deleted"}
