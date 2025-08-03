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
## [2025-07-22 10:04:51 UTC] Decision: Add API tests
**Context**: Core authentication and persona routes were implemented without automated verification.
**Decision**: Added pytest-based test suite with fixtures spinning up a temporary SQLite database. Tests cover user signup/login and persona creation/update. Created `requirements-dev.txt` with pytest for development dependencies.
**Reasoning**: Automated tests ensure API functionality remains stable as the project evolves and provide a quick regression check for future contributions.
## [2025-07-22 10:04:44 UTC] Decision: Add Postgres driver dependency
**Context**: Postgres is used via SQLAlchemy but the driver was missing from `requirements.txt` and thus from the backend container.
**Decision**: Appended `psycopg2-binary` to `requirements.txt` and documented rebuilding the backend Docker image in `README.md`.
**Reasoning**: `psycopg2-binary` ensures database connectivity when running in Docker or locally. Documentation reminds developers to rebuild so the dependency is installed.
## [2025-07-22 10:05:26 UTC] Decision: Store KB clarifications as entries
**Context**: Implemented `/knowledgebase` endpoints. Needed to decide how to persist clarification answers.**
**Decision**: Represent clarifications as `KnowledgeBaseEntry` records with `type` `preference` and `source` `user_answer`. This reuses the existing table without introducing a new model.
**Reasoning**: Using the same schema keeps the knowledge base unified and avoids managing a separate answers table. Each answer simply contributes a new entry, making retrieval via `GET /knowledgebase` straightforward.
## [2025-07-22 10:05:26 UTC] Decision: Fix persona overrides update
**Context**: Updating a persona previously allowed storing an `overrides` attribute on the SQLAlchemy model rather than persisting it to the `data` JSON field.
**Decision**: In `update_persona` we now call `data.dict(exclude_unset=True)` and map the `overrides` key to `persona.data` before applying other fields.
**Reasoning**: Ensures persona override data is saved correctly and prevents stray attributes on the model.
## [2025-07-22 10:06:00 UTC] Decision: Add export endpoint
**Context**: API_SPEC defined a route to export personas but it was missing from the code.
**Decision**: Implemented `POST /export/{persona_id}` router using Jinja2 to render persona data to Markdown, then optionally convert to PDF with `fpdf2`. Results are saved under `uploads/` and returned as a URL. Added `ExportRequest` and `ExportResponse` schemas and included the router in the main API. Dependencies `jinja2`, `markdown`, and `fpdf2` were added.
**Reasoning**: Enables basic persona export functionality matching the spec while keeping implementation lightweight and extensible for future template customization.
## [2025-07-22 10:04:49 UTC] Decision: Enable CORS middleware
**Context**: Frontend on a different port needs to call API during development.
**Decision**: Added `CORSMiddleware` with origins from `ALLOWED_ORIGINS` env variable defaulting to `*`.
**Reasoning**: Allows local frontend development without errors while remaining configurable for production.
## [2025-08-03 04:41:47 UTC] Decision: Add auth form components
**Context**: Frontend lacked reusable components and theming for authentication screens.
**Decision**: Introduced Button and Input primitives, LoginForm and SignupForm components, centralized API helper, and Tailwind theme tokens with next-themes provider.
**Reasoning**: Establishes consistent, accessible building blocks and prepares the app for dark mode across login and signup pages.
