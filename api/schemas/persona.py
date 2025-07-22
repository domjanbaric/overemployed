from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class PersonaBase(BaseModel):
    title: str
    summary: Optional[str] = None
    tags: Optional[List[str]] = None


class PersonaCreate(PersonaBase):
    base_cv_id: Optional[str] = None
    overrides: Optional[dict] = None


class PersonaOut(PersonaBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
