from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/knowledgebase", tags=["knowledgebase"])


@router.get("", response_model=schemas.KnowledgeBaseOut)
def list_entries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    entries = (
        db.query(models.KnowledgeBaseEntry)
        .filter(models.KnowledgeBaseEntry.user_id == current_user.id)
        .all()
    )
    grouped = {
        "skills": [],
        "tools": [],
        "domains": [],
        "soft_skills": [],
        "preferences": [],
    }
    for e in entries:
        if e.type == models.KBType.skill:
            grouped["skills"].append(e.value)
        elif e.type == models.KBType.tool:
            grouped["tools"].append(e.value)
        elif e.type == models.KBType.domain:
            grouped["domains"].append(e.value)
        elif e.type == models.KBType.soft_skill:
            grouped["soft_skills"].append(e.value)
        elif e.type == models.KBType.preference:
            grouped["preferences"].append(e.value)
    return grouped


@router.post("/clarify", response_model=list[schemas.KBEntryOut])
def clarify_answers(
    data: schemas.ClarifyRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not data.answers:
        raise HTTPException(status_code=400, detail="answers required")
    new_entries = []
    for _qid, answer in data.answers.items():
        entry = models.KnowledgeBaseEntry(
            user_id=current_user.id,
            type=models.KBType.preference,
            value=answer,
            source=models.KBSource.user_answer,
        )
        db.add(entry)
        new_entries.append(entry)
    db.commit()
    for entry in new_entries:
        db.refresh(entry)
    return new_entries
