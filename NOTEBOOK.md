# NOTEBOOK.md – Decision Log & Codex Reasoning Journal

This notebook serves as a structured journal for design decisions, architectural changes, prompt formats, schema reasoning, and anything Codex (or other developers) want to justify or reflect on.

Each entry includes:
- Timestamp
- Short title
- Context for the decision
- Final decision made
- Reasoning or alternatives considered

---
## [2025-07-22 09:15:14 UTC] Decision: Initial backend scaffolding
**Context**: Project only contained docs and empty API package. Need to start backend app.
**Decision**: Added SQLAlchemy models based on DATABASE.md, Pydantic schemas per API_SPEC, FastAPI routers for auth, user, CV, persona, and gap analysis with simple file storage and JWT auth. Created database engine using SQLite for dev and assembled main FastAPI app.
**Reasoning**: Provides working baseline API aligning with specification. Using SQLite avoids external dependencies. Gap analysis endpoints return empty issue lists until AI integration.
## [2025-07-22 09:41:54 UTC] Decision: Add Postgres and Minio services
**Context**: The stack previously only had backend and frontend containers. Database used local SQLite and file uploads stored on local disk. We want containerized Postgres and object storage plus shared env configuration.
**Decision**: Added `db` and `minio` services to `docker-compose.yml` with persistent volumes and exposed ports. Created `.env` file with dev credentials and referenced it from all services. Updated backend code to read `DATABASE_URL` and `SECRET_KEY` from environment variables so Compose configuration applies automatically.
**Reasoning**: Provides consistent dev environment with stateful services and avoids hardcoding secrets or SQLite path. Environment variables make configuration flexible for production.
## [2025-07-22 10:05:26 UTC] Decision: Store KB clarifications as entries
**Context**: Implemented `/knowledgebase` endpoints. Needed to decide how to persist clarification answers.**
**Decision**: Represent clarifications as `KnowledgeBaseEntry` records with `type` `preference` and `source` `user_answer`. This reuses the existing table without introducing a new model.
**Reasoning**: Using the same schema keeps the knowledge base unified and avoids managing a separate answers table. Each answer simply contributes a new entry, making retrieval via `GET /knowledgebase` straightforward.
