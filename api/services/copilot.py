from __future__ import annotations

import json
from string import Template as StrTemplate

from openai import OpenAI

from ..models import Persona, Template

TAILOR_PROMPT = StrTemplate(
    """You are an expert resume writer. Using the following persona data in JSON and job description, "
    "tailor the persona to the job. Render the output using the provided template and return Markdown only.\n\n"
    "Persona JSON:\n${persona}\n\nJob Description:\n${job}\n\nTemplate:\n${template}\n"""
)


class TailorCopilot:
    """Generates a tailored CV using OpenAI based on persona and job description."""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.client = OpenAI()
        self.model = model

    def tailor(self, persona: Persona, job_description: str, template: Template) -> str:
        persona_json = json.dumps({
            "title": persona.title,
            "summary": persona.summary,
            "tags": persona.tags,
            "data": persona.data or {},
        })
        prompt = TAILOR_PROMPT.substitute(
            persona=persona_json, job=job_description, template=template.config.get("template", "")
        )
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content
