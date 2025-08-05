

from typing import List, Literal
from pydantic import BaseModel

class GapIssue(BaseModel):
    field: str
    suggestion: str
    severity: str


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class GapReportOut(BaseModel):
    issues: List[GapIssue] = []
    questions: List[str] = []
    messages: List[ChatMessage] = []


class GapAskRequest(BaseModel):
    analysis_type: str
    messages: List[ChatMessage]
    user_input: str


class TeamGapRequest(BaseModel):
    persona_ids: List[str]
    team_description: str
