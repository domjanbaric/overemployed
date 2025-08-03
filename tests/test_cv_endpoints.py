import io
from uuid import uuid4
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


def test_cv_upload_list_get_parse(client, tmp_path, monkeypatch):
    from api.routers import cv as cv_router

    cv_router.UPLOAD_DIR = tmp_path / "uploads"
    cv_router.UPLOAD_DIR.mkdir()

    # patch parser to avoid external calls
    monkeypatch.setattr("api.routers.cv.CVParser.__init__", lambda self: None)
    def fake_extract_text(self, path):
        return "text"

    def fake_parse(self, text):
        return {"name": "Parsed"}

    monkeypatch.setattr("api.routers.cv.CVParser.extract_text", fake_extract_text)
    monkeypatch.setattr("api.routers.cv.CVParser.parse", fake_parse)

    token = signup_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    upload_resp = client.post(
        "/cv/upload",
        files={"file": ("cv.txt", io.BytesIO(b"content"), "text/plain")},
        headers=headers,
    )
    assert upload_resp.status_code == 200
    cv_id = upload_resp.json()["id"]

    list_resp = client.get("/cv/list", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1

    get_resp = client.get(f"/cv/{cv_id}", headers=headers)
    assert get_resp.status_code == 200

    parse_resp = client.post(f"/cv/{cv_id}/parse", headers=headers)
    assert parse_resp.status_code == 200
    assert parse_resp.json()["parsed_json"] == {"name": "Parsed"}

    missing_id = uuid4()
    missing_resp = client.get(f"/cv/{missing_id}", headers=headers)
    assert missing_resp.status_code == 404

    parse_missing = client.post(f"/cv/{missing_id}/parse", headers=headers)
    assert parse_missing.status_code == 404
