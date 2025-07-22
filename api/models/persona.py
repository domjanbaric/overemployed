from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class Persona(Base):
    __tablename__ = "personas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text)
    tags = Column(ARRAY(String))
    data = Column(JSON)
    base_cv_id = Column(UUID(as_uuid=True), ForeignKey("cvs.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="personas")
    base_cv = relationship("CV", back_populates="personas")
    gap_reports = relationship("GapReport", back_populates="persona")
