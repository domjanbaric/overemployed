import json
from api.services.cv_parser import CVParser
from api.services import prompts


def test_cv_parser_uses_template(monkeypatch):
    captured = {}

    class DummyCompletions:
        def __init__(self, outer):
            self.outer = outer

        def create(self, model, messages):
            self.outer["messages"] = messages
            content = json.dumps({"name": "X", "experience": []})
            return type(
                "Resp",
                (),
                {
                    "choices": [
                        type(
                            "Choice", (), {"message": type("Msg", (), {"content": content})()}
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

    monkeypatch.setattr("api.services.cv_parser.OpenAI", DummyClient)

    parser = CVParser()
    result = parser.parse("my cv")

    assert captured["messages"][0]["content"] == prompts.CV_PARSE_TEMPLATE.substitute(
        cv="my cv"
    )
    assert result["name"] == "X"
