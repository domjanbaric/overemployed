from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    plan: str
    team_id: Optional[UUID] = None

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None
