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
## [2025-07-22 10:06:00 UTC] Decision: Add export endpoint
**Context**: API_SPEC defined a route to export personas but it was missing from the code.
**Decision**: Implemented `POST /export/{persona_id}` router using Jinja2 to render persona data to Markdown, then optionally convert to PDF with `fpdf2`. Results are saved under `uploads/` and returned as a URL. Added `ExportRequest` and `ExportResponse` schemas and included the router in the main API. Dependencies `jinja2`, `markdown`, and `fpdf2` were added.
**Reasoning**: Enables basic persona export functionality matching the spec while keeping implementation lightweight and extensible for future template customization.
## [2025-07-22 10:04:49 UTC] Decision: Enable CORS middleware
**Context**: Frontend on a different port needs to call API during development.
**Decision**: Added `CORSMiddleware` with origins from `ALLOWED_ORIGINS` env variable defaulting to `*`.
**Reasoning**: Allows local frontend development without errors while remaining configurable for production.
