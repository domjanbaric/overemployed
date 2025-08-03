from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

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

    model_config = ConfigDict(from_attributes=True)


TeamMembersOut = List[UserOut]
TeamPersonasOut = List[PersonaOut]
