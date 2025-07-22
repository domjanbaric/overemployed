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
