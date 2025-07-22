from sqlalchemy import Column, Enum, JSON, String
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class TemplateType(str, Enum):
    cv = "cv"
    cover_letter = "cover_letter"


class TemplateEngine(str, Enum):
    markdown = "markdown"
    jinja = "jinja"


class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(Enum(TemplateType), nullable=False)
    engine = Column(Enum(TemplateEngine), nullable=False)
    config = Column(JSON)
