from sqlalchemy import Column, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class KBType(str, Enum):
    skill = "skill"
    tool = "tool"
    domain = "domain"
    soft_skill = "soft_skill"
    preference = "preference"


class KBSource(str, Enum):
    cv = "cv"
    user_answer = "user_answer"
    ai_extraction = "ai_extraction"


class KnowledgeBaseEntry(Base):
    __tablename__ = "knowledgebase_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(Enum(KBType), nullable=False)
    value = Column(String, nullable=False)
    source = Column(Enum(KBSource), nullable=False)
