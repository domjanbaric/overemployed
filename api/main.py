from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routers import api_router
from .database import Base, engine

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
