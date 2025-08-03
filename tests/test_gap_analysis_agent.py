import json
from api.services.gap_analysis import GapAnalysisAgent
from api.services import prompts


def test_gap_analysis_agent_uses_template(monkeypatch):
    captured = {}

    class DummyCompletions:
        def __init__(self, outer):
            self.outer = outer

        def create(self, model, messages):
            self.outer["messages"] = messages
            content = json.dumps({"issues": [], "questions": ["Q1"]})
            return type(
                "Resp",
                (),
                {
                    "choices": [
                        type(
                            "Choice",
                            (),
                            {"message": type("Msg", (), {"content": content})()},
                        )
                    ]
                },
            )()

    class DummyChat:
        def __init__(self, outer):
            self.completions = DummyCompletions(outer)

    class DummyClient:
        def __init__(self):
            self.chat = DummyChat(captured)

    monkeypatch.setattr("api.services.gap_analysis.OpenAI", DummyClient)

    agent = GapAnalysisAgent("cv_analysis")
    result = agent.start(cv="my cv")

    assert captured["messages"][0]["content"] == prompts.GAP_ANALYSIS_PROMPTS[
        "cv_analysis"
    ].substitute(cv="my cv")
    assert result.questions == ["Q1"]


def test_role_match_includes_kb(monkeypatch):
    captured = {}

    class DummyCompletions:
        def __init__(self, outer):
            self.outer = outer

        def create(self, model, messages):
            self.outer["messages"] = messages
            content = json.dumps({"issues": [], "questions": ["Q1"]})
            return type(
                "Resp",
                (),
                {
                    "choices": [
                        type(
                            "Choice",
                            (),
                            {"message": type("Msg", (), {"content": content})()},
                        )
                    ]
                },
            )()

    class DummyChat:
        def __init__(self, outer):
            self.completions = DummyCompletions(outer)

    class DummyClient:
        def __init__(self):
            self.chat = DummyChat(captured)

    monkeypatch.setattr("api.services.gap_analysis.OpenAI", DummyClient)

    agent = GapAnalysisAgent("cv_job_match")
    kb_json = json.dumps({"skills": ["Python"]})
    result = agent.start(cv="my cv", job="desc", kb=kb_json)

    expected = prompts.GAP_ANALYSIS_PROMPTS["cv_job_match"].substitute(
        cv="my cv", job="desc", kb=kb_json
    )
    assert captured["messages"][0]["content"] == expected
    assert result.questions == ["Q1"]
