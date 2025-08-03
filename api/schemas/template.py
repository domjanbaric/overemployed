from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from ..models.template import TemplateType, TemplateEngine


class TemplateBase(BaseModel):
    name: str
    type: TemplateType
    engine: TemplateEngine
    config: Dict[str, Any]


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[TemplateType] = None
    engine: Optional[TemplateEngine] = None
    config: Optional[Dict[str, Any]] = None


class TemplateOut(TemplateBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class TailorRequest(BaseModel):
    persona_id: str
    job_description: str


class TailorResponse(BaseModel):
    content: str
