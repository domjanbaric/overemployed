from __future__ import annotations

import json
from typing import Dict, List

from openai import OpenAI

from ..schemas.gap import GapReportOut, ChatMessage
from .prompts import GAP_ANALYSIS_PROMPTS


class GapAnalysisAgent:
    """Chatbot-style agent performing various gap analyses using OpenAI."""

    def __init__(self, analysis_type: str, model: str = "gpt-4o-mini"):
        if analysis_type not in GAP_ANALYSIS_PROMPTS:
            raise ValueError("Unsupported analysis type")
        self.analysis_type = analysis_type
        self.model = model
        self.client = OpenAI()
        self.messages: List[Dict[str, str]] = []

    def start(self, **context: str) -> GapReportOut:
        """Begin analysis with initial context and return issues and questions."""
        template = GAP_ANALYSIS_PROMPTS[self.analysis_type]
        system_prompt = template.substitute(**context)
        self.messages = [{"role": "system", "content": system_prompt}]
        response = self.client.chat.completions.create(
            model=self.model, messages=self.messages
        )
        content = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": content})
        data = json.loads(content)
        return GapReportOut(**data, messages=[ChatMessage(**m) for m in self.messages])

    def ask(self, user_input: str) -> GapReportOut:
        """Continue the conversation with user input."""
        self.messages.append({"role": "user", "content": user_input})
        response = self.client.chat.completions.create(
            model=self.model, messages=self.messages
        )
        content = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": content})
        data = json.loads(content)
        return GapReportOut(**data, messages=[ChatMessage(**m) for m in self.messages])
