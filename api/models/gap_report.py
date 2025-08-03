from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, DateTime, Enum as SQLAlchemyEnum, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class GapType(str, PyEnum):
    general = "general"
    role_specific = "role_specific"
    team = "team"


class GapReport(Base):
    __tablename__ = "gap_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    persona_id = Column(UUID(as_uuid=True), ForeignKey("personas.id"), nullable=False)
    type = Column(SQLAlchemyEnum(GapType), nullable=False)
    input_text = Column(Text)
    issues = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    persona = relationship("Persona", back_populates="gap_reports")
