from typing import List
from pydantic import BaseModel


class GapIssue(BaseModel):
    field: str
    suggestion: str
    severity: str


class GapReportOut(BaseModel):
    issues: List[GapIssue] = []
    questions: List[str] = []


class TeamGapRequest(BaseModel):
    persona_ids: List[str]
    team_description: str
