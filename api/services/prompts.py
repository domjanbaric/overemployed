from string import Template

CV_ANALYSIS_TEMPLATE = Template(
    """
You are an expert career coach performing a CV gap analysis.

CV:
${cv}

Respond in JSON with two keys:
- "issues": list of objects {"field", "suggestion", "severity"}
- "questions": list of clarifying questions for the user
"""
)

CV_JOB_MATCH_TEMPLATE = Template(
    """
You are an AI recruiter comparing a candidate's CV against a job posting.

CV:
${cv}

Job Description:
${job}

Respond in JSON with two keys:
- "issues": list of objects {"field", "suggestion", "severity"}
- "questions": list of clarifying questions for the user
"""
)

TEAM_ANALYSIS_TEMPLATE = Template(
    """
You are an organizational consultant evaluating a team's capabilities against a target profile.

Team Members:
${team}

Team Goal:
${goal}

Respond in JSON with two keys:
- "issues": list of objects {"field", "suggestion", "severity"}
- "questions": list of clarifying questions for the user
"""
)

GAP_ANALYSIS_PROMPTS = {
    "cv_analysis": CV_ANALYSIS_TEMPLATE,
    "cv_job_match": CV_JOB_MATCH_TEMPLATE,
    "team_analysis": TEAM_ANALYSIS_TEMPLATE,
}
