from datetime import datetime
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class PlanEnum(str, Enum):
    free = "free"
    pro = "pro"
    team = "team"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    plan = Column(Enum(PlanEnum), default=PlanEnum.free, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)

    team = relationship("Team", back_populates="members")
    cvs = relationship("CV", back_populates="user")
    personas = relationship("Persona", back_populates="user")
