from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CVPreview(BaseModel):
    id: UUID
    filename: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CVDetail(CVPreview):
    raw_text: Optional[str] = None
    parsed_json: Optional[dict] = None
