from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routers import api_router
from .database import Base, engine, SQLALCHEMY_DATABASE_URL

# Only create tables automatically when using the default SQLite database. This
# avoids attempting to connect to external databases (e.g. Postgres) during
# application import, which can fail in environments like tests.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="PersonaForge API")

origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
if origins_env == "*":
    allow_origins = ["*"]
else:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
