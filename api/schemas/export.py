from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ExportFormat(str, Enum):
    pdf = "pdf"
    md = "md"


class ExportRequest(BaseModel):
    format: ExportFormat
    template_id: Optional[str] = None


class ExportResponse(BaseModel):
    file_url: str
