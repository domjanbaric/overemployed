from pydantic import BaseModel, ConfigDict
from typing import Dict, List
from uuid import UUID


class KnowledgeBaseOut(BaseModel):
    skills: List[str] = []
    tools: List[str] = []
    domains: List[str] = []
    soft_skills: List[str] = []
    preferences: List[str] = []


class KBEntryOut(BaseModel):
    id: UUID
    type: str
    value: str
    source: str

    model_config = ConfigDict(from_attributes=True)


class ClarifyRequest(BaseModel):
    answers: Dict[str, str]
