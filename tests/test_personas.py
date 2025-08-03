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

def test_list_get_delete_persona(client):
    token = signup_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    resp1 = client.post(
        "/personas",
        json={"title": "P1", "summary": ""},
        headers=headers,
    )
    resp2 = client.post(
        "/personas",
        json={"title": "P2", "summary": ""},
        headers=headers,
    )
    assert resp1.status_code == 200 and resp2.status_code == 200

    list_resp = client.get("/personas", headers=headers)
    assert list_resp.status_code == 200
    personas = list_resp.json()
    assert len(personas) == 2

    p1_id = personas[0]["id"]
    get_resp = client.get(f"/personas/{p1_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == p1_id

    del_resp = client.delete(f"/personas/{p1_id}", headers=headers)
    assert del_resp.status_code == 200

    list_after = client.get("/personas", headers=headers)
    assert len(list_after.json()) == 1

    missing = client.get(f"/personas/{p1_id}", headers=headers)
    assert missing.status_code == 404
