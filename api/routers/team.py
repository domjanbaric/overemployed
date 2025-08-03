from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, get_current_user


router = APIRouter(prefix="/team", tags=["team"])


@router.get("/members", response_model=schemas.TeamMembersOut)
def get_team_members(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not current_user.team_id:
        return []
    return db.query(models.User).filter(models.User.team_id == current_user.team_id).all()


@router.get("/personas", response_model=schemas.TeamPersonasOut)
def get_team_personas(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not current_user.team_id:
        return []
    return (
        db.query(models.Persona)
        .join(models.User)
        .filter(models.User.team_id == current_user.team_id)
        .all()
    )


@router.post("/invite", response_model=schemas.TeamInviteOut)
def invite_team_member(
    data: schemas.TeamInviteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not current_user.team_id:
        team = models.Team(name=f"{current_user.name}'s Team", owner_id=current_user.id)
        db.add(team)
        db.commit()
        db.refresh(team)
        current_user.team_id = team.id
        db.add(current_user)
        db.commit()
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        existing_user.team_id = current_user.team_id
        db.add(existing_user)
        db.commit()
        db.refresh(existing_user)
        invite = models.TeamInvite(
            team_id=current_user.team_id,
            email=data.email,
            token="",
            accepted=True,
        )
        db.add(invite)
        db.commit()
        db.refresh(invite)
        return invite
    invite = models.TeamInvite(team_id=current_user.team_id, email=data.email)
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite

