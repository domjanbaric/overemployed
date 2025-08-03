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


def signup_get_token(client: TestClient) -> str:
    resp = client.post(
        "/auth/signup",
        json={"email": "user@example.com", "password": "secret", "name": "User"},
    )
    return resp.json()["token"]


def test_create_and_update_persona(client):
    token = signup_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = client.post(
        "/personas",
        json={
            "title": "Engineer",
            "summary": "Initial",
            "tags": ["python"],
        },
        headers=headers,
    )
    assert create_resp.status_code == 200
    persona = create_resp.json()
    assert persona["title"] == "Engineer"

    update_resp = client.patch(
        f"/personas/{persona['id']}",
        json={"title": "Engineer", "summary": "Updated"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["summary"] == "Updated"
