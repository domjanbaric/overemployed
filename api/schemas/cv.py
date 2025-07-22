from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class CVPreview(BaseModel):
    id: str
    filename: str
    created_at: datetime

    class Config:
        orm_mode = True


class CVDetail(CVPreview):
    raw_text: Optional[str] = None
    parsed_json: Optional[dict] = None
