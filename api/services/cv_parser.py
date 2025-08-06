from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict

from openai import OpenAI

from .prompts import CV_PARSE_TEMPLATE


class CVParser:
    """Extracts structured data from CV text using OpenAI."""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.client = OpenAI()
        self.model = model

    def extract_text(self, file_path: Path) -> str:
        suffix = file_path.suffix.lower()
        if suffix == ".pdf":
            from pypdf import PdfReader

            reader = PdfReader(str(file_path))
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        elif suffix in {".doc", ".docx"}:
            import docx

            doc = docx.Document(str(file_path))
            return "\n".join(p.text for p in doc.paragraphs)
        else:
            return file_path.read_text()

    def parse(self, cv_text: str) -> Dict:
        """Return structured data for the supplied CV text."""

        prompt = CV_PARSE_TEMPLATE.substitute(cv=cv_text)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
        )
        content = (response.choices[0].message.content or "").strip()
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Sometimes the model wraps JSON in code fences or adds prose.
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                return json.loads(match.group())
            raise ValueError("Model did not return valid JSON")
