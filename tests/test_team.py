import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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


def signup(client: TestClient, email: str, name: str = "User") -> str:
    resp = client.post(
        "/auth/signup",
        json={"email": email, "password": "secret", "name": name},
    )
    assert resp.status_code == 200
    return resp.json()["token"]


def test_team_invite_and_listing(client):
    token_owner = signup(client, "owner@example.com", name="Owner")
    token_member = signup(client, "member@example.com", name="Member")

    headers_owner = {"Authorization": f"Bearer {token_owner}"}

    invite_resp = client.post(
        "/team/invite",
        json={"email": "member@example.com"},
        headers=headers_owner,
    )
    assert invite_resp.status_code == 200
    assert invite_resp.json()["accepted"] is True

    members_resp = client.get("/team/members", headers=headers_owner)
    assert members_resp.status_code == 200
    assert len(members_resp.json()) == 2

    # create persona for member
    headers_member = {"Authorization": f"Bearer {token_member}"}
    persona_resp = client.post(
        "/personas",
        json={"title": "Dev", "summary": ""},
        headers=headers_member,
    )
    assert persona_resp.status_code == 200

    personas_resp = client.get("/team/personas", headers=headers_owner)
    assert personas_resp.status_code == 200
    assert len(personas_resp.json()) == 1
