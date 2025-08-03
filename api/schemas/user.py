from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class UserOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    plan: str
    team_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None
