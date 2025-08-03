from pydantic import BaseModel
from typing import Dict


class KBEntryOut(BaseModel):
    id: str
    type: str
    value: str
    source: str

    class Config:
        orm_mode = True


class ClarifyRequest(BaseModel):
    answers: Dict[str, str]
