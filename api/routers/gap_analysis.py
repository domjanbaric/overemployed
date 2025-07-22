from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/gap_analysis", tags=["gap_analysis"])


@router.get("/{persona_id}", response_model=schemas.GapReportOut)
def general_gap_analysis(
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
    # Placeholder for actual AI analysis
    return schemas.GapReportOut(issues=[])


@router.post("/role_match", response_model=schemas.GapReportOut)
def role_specific_gap_analysis(
    data: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona_id = data.get("persona_id")
    job_description = data.get("job_description")
    if not persona_id or not job_description:
        raise HTTPException(
            status_code=400, detail="persona_id and job_description required"
        )
    persona = (
        db.query(models.Persona)
        .filter(
            models.Persona.id == persona_id, models.Persona.user_id == current_user.id
        )
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    # Placeholder for AI role match analysis
    return schemas.GapReportOut(issues=[])
