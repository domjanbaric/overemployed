from datetime import datetime
from uuid import UUID
from typing import List
from pydantic import BaseModel, EmailStr

from .user import UserOut
from .persona import PersonaOut


class TeamInviteCreate(BaseModel):
    email: EmailStr


class TeamInviteOut(BaseModel):
    id: UUID
    team_id: UUID
    email: EmailStr
    token: str
    accepted: bool
    created_at: datetime

    class Config:
        orm_mode = True


TeamMembersOut = List[UserOut]
TeamPersonasOut = List[PersonaOut]
