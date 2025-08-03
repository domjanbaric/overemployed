from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, get_current_user
from ..services.copilot import TailorCopilot

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/", response_model=List[schemas.TemplateOut])
def list_templates(db: Session = Depends(get_db)):
    return db.query(models.Template).all()


@router.post("/", response_model=schemas.TemplateOut)
def create_template(
    template: schemas.TemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tmpl = models.Template(**template.model_dump())
    db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return tmpl


@router.get("/{template_id}", response_model=schemas.TemplateOut)
def get_template(template_id: UUID, db: Session = Depends(get_db)):
    tmpl = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    return tmpl


@router.patch("/{template_id}", response_model=schemas.TemplateOut)
def update_template(
    template_id: UUID,
    template: schemas.TemplateUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tmpl = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    for field, value in template.model_dump(exclude_unset=True).items():
        setattr(tmpl, field, value)
    db.commit()
    db.refresh(tmpl)
    return tmpl


@router.delete("/{template_id}")
def delete_template(
    template_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tmpl = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(tmpl)
    db.commit()
    return {"status": "deleted"}


@router.post("/{template_id}/tailor", response_model=schemas.TailorResponse)
def tailor_template(
    template_id: UUID,
    request: schemas.TailorRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tmpl = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    persona = (
        db.query(models.Persona)
        .filter(
            models.Persona.id == UUID(request.persona_id),
            models.Persona.user_id == current_user.id,
        )
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    copilot = TailorCopilot()
    content = copilot.tailor(persona, request.job_description, tmpl)
    return schemas.TailorResponse(content=content)
