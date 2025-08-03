import os
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


def test_signup_and_login(client):
    signup_resp = client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "secret", "name": "Tester"},
    )
    assert signup_resp.status_code == 200
    assert signup_resp.json()["token"]

    login_resp = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "secret"},
    )
    assert login_resp.status_code == 200
    assert login_resp.json()["token"]
