from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, DateTime, Enum as SQLAlchemyEnum, ForeignKey, String, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class CVStatus(str, PyEnum):
    pending = "pending"
    parsed = "parsed"
    failed = "failed"


class CV(Base):
    __tablename__ = "cvs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    raw_text = Column(Text)
    parsed_json = Column(JSON)
    status = Column(SQLAlchemyEnum(CVStatus), default=CVStatus.pending)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="cvs")
    personas = relationship("Persona", back_populates="base_cv")
