from fastapi import FastAPI
from .routers import api_router
from .database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PersonaForge API")
app.include_router(api_router)
