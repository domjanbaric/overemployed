from typing import List, Optional
from pydantic import BaseModel


class GapIssue(BaseModel):
    field: str
    suggestion: str
    severity: str


class GapReportOut(BaseModel):
    issues: List[GapIssue]
