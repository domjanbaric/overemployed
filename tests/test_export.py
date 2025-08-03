import pytest
from pathlib import Path
from uuid import uuid4
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


def create_persona(client: TestClient, headers) -> str:
    resp = client.post(
        "/personas",
        json={"title": "Dev", "summary": "Great", "tags": []},
        headers=headers,
    )
    assert resp.status_code == 200
    return resp.json()["id"]


def create_template(client: TestClient, headers) -> str:
    resp = client.post(
        "/templates",
        json={
            "name": "T",
            "type": "cv",
            "engine": "markdown",
            "config": {"template": "# {{ persona.title }}"},
        },
        headers=headers,
    )
    assert resp.status_code == 200
    return resp.json()["id"]


def test_export_markdown_with_template(client, tmp_path):
    from api.routers import export as export_router

    export_router.UPLOAD_DIR = tmp_path / "exports"
    export_router.UPLOAD_DIR.mkdir()

    token = signup_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    persona_id = create_persona(client, headers)
    template_id = create_template(client, headers)

    resp = client.post(
        f"/export/{persona_id}",
        json={"format": "md", "template_id": template_id},
        headers=headers,
    )
    assert resp.status_code == 200
    file_url = resp.json()["file_url"]
    filename = Path(file_url).name
    assert (export_router.UPLOAD_DIR / filename).exists()
    content = (export_router.UPLOAD_DIR / filename).read_text()
    assert "Dev" in content

    not_found = client.post(
        f"/export/{uuid4()}",
        json={"format": "md"},
        headers=headers,
    )
    assert not_found.status_code == 404
