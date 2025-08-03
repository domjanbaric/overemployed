import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.main import app
from api.database import Base
from api.deps import get_db
from api.schemas import gap as gap_schemas


@pytest.fixture()
def client(tmp_path):
    db_url = f"sqlite:///{tmp_path}/test.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def signup_token(client: TestClient) -> str:
    resp = client.post(
        "/auth/signup",
        json={"email": "user@example.com", "password": "secret", "name": "User"},
    )
    assert resp.status_code == 200
    return resp.json()["token"]


def create_persona(client: TestClient, headers) -> str:
    resp = client.post(
        "/personas",
        json={"title": "Dev", "summary": "Summary"},
        headers=headers,
    )
    assert resp.status_code == 200
    return resp.json()["id"]


def test_gap_analysis_endpoints(client, monkeypatch):
    token = signup_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    persona_id = create_persona(client, headers)

    monkeypatch.setattr(
        "api.routers.gap_analysis.GapAnalysisAgent.__init__", lambda self, _: None
    )

    def dummy_start(self, **kwargs):
        return gap_schemas.GapReportOut(issues=[], questions=["Q"])

    monkeypatch.setattr(
        "api.routers.gap_analysis.GapAnalysisAgent.start", dummy_start
    )

    resp = client.get(f"/gap_analysis/{persona_id}", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["questions"] == ["Q"]

    role_resp = client.post(
        "/gap_analysis/role_match",
        json={"persona_id": persona_id, "job_description": "JD"},
        headers=headers,
    )
    assert role_resp.status_code == 200
    assert role_resp.json()["questions"] == ["Q"]

    team_resp = client.post(
        "/gap_analysis/team",
        json={"persona_ids": [persona_id], "team_description": "Goal"},
        headers=headers,
    )
    assert team_resp.status_code == 200
    assert team_resp.json()["questions"] == ["Q"]

    not_found = client.get(f"/gap_analysis/{uuid4()}", headers=headers)
    assert not_found.status_code == 404

    bad_req = client.post(
        "/gap_analysis/role_match",
        json={"persona_id": persona_id},
        headers=headers,
    )
    assert bad_req.status_code == 400
