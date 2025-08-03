from enum import Enum as PyEnum
from sqlalchemy import Column, Enum as SQLAlchemyEnum, JSON, String
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class TemplateType(str, PyEnum):
    cv = "cv"
    cover_letter = "cover_letter"


class TemplateEngine(str, PyEnum):
    markdown = "markdown"
    jinja = "jinja"


class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(SQLAlchemyEnum(TemplateType), nullable=False)
    engine = Column(SQLAlchemyEnum(TemplateEngine), nullable=False)
    config = Column(JSON)
