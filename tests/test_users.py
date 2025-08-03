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


def signup_token(client: TestClient) -> str:
    resp = client.post(
        "/auth/signup",
        json={"email": "user@example.com", "password": "secret", "name": "User"},
    )
    assert resp.status_code == 200
    return resp.json()["token"]


def test_get_me_returns_current_user(client):
    token = signup_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/users/me", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "user@example.com"
    assert data["name"] == "User"
    assert data["plan"] == "free"


def test_update_me_changes_fields(client):
    token = signup_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    update_resp = client.patch(
        "/users/me", json={"name": "Updated"}, headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Updated"

    get_resp = client.get("/users/me", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Updated"

