"""FastAPI application entrypoint."""

import argparse
import os
from dotenv import load_dotenv, find_dotenv

# Allow a custom path to an `.env` file via ``--env-file``. When provided the
# specified file is loaded before any other imports so configuration is in
# place for modules like the database engine.
parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("--env-file", help="Path to environment file")
args, _ = parser.parse_known_args()

if args.env_file:
    load_dotenv(args.env_file, override=True)
else:  # Fall back to the closest `.env` discovered automatically
    load_dotenv(find_dotenv())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
