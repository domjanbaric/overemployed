import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from api.main import app
from api.database import Base
from api.deps import get_db


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


def signup_get_token(client: TestClient) -> str:
    resp = client.post(
        "/auth/signup",
        json={"email": "user@example.com", "password": "secret", "name": "User"},
    )
    return resp.json()["token"]


def test_clarify_and_list_knowledgebase(client):
    token = signup_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # Initial KB should be empty groups
    resp = client.get("/knowledgebase", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == {
        "skills": [],
        "tools": [],
        "domains": [],
        "soft_skills": [],
        "preferences": [],
    }

    # Clarify with a preference answer
    clarify_resp = client.post(
        "/knowledgebase/clarify",
        json={"answers": {"q1": "Remote work"}},
        headers=headers,
    )
    assert clarify_resp.status_code == 200

    # KB should now include the preference
    resp2 = client.get("/knowledgebase", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["preferences"] == ["Remote work"]
