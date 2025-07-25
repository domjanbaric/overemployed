from datetime import datetime
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class GapType(str, Enum):
    general = "general"
    role_specific = "role_specific"


class GapReport(Base):
    __tablename__ = "gap_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    persona_id = Column(UUID(as_uuid=True), ForeignKey("personas.id"), nullable=False)
    type = Column(Enum(GapType), nullable=False)
    input_text = Column(Text)
    issues = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    persona = relationship("Persona", back_populates="gap_reports")
