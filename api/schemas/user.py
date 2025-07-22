from typing import Optional
from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    plan: str
    team_id: Optional[str] = None

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None
