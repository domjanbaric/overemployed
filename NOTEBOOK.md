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
## [2025-08-03 04:55:04 UTC] Decision: Build core application screens
**Context**: Only authentication pages existed on the frontend and the dashboard/other screens from FRONTEND_OUTLINE were missing.
**Decision**: Added API utilities and implemented Dashboard, Upload, Apply, and Persona detail pages with reusable components (UploadButton, PersonaCard, KnowledgeBaseSummary, CVParsePreview, job tailoring tools, and export controls).
**Reasoning**: Aligns UI with project outline, enabling CV uploads, persona management, gap analysis and role-specific tailoring directly from the frontend.
## [2025-08-03 05:18:13 UTC] Decision: Add OpenAI-based gap analysis agent
**Context**: Needed flexible gap analysis covering CV quality, CV vs job matching, and team composition with follow-up questions.
**Decision**: Added prompt templates in `api/services/prompts.py`, implemented `GapAnalysisAgent` leveraging OpenAI chat models, extended schemas and router to support CV, role match, and team analyses with clarifying questions.
**Reasoning**: Centralized templates enable consistent messaging, while a reusable agent provides chatbot-style interactions for various gap analysis scenarios.

## [2025-08-03 05:55:19 UTC] Decision: Surface gap analysis questions in frontend
**Context**: Frontend only displayed static issues and lacked support for role or team gap analyses.
**Decision**: Updated API utilities and UI panels to consume a unified `GapReport` shape, exposing clarifying questions for CV, role-match, and team analyses.
**Reasoning**: Ensures consistent chatbot-style interactions across analysis modes and prepares UI for follow-up conversations.

## [2025-08-03 06:31:34 UTC] Decision: Document implemented features
**Context**: Needed to reflect current project progress in `FEATURES.md`.
**Decision**: Reviewed repository to determine which planned features are implemented and marked them with checkboxes in `FEATURES.md`.
**Reasoning**: Keeps feature roadmap up to date, highlighting completed work and remaining scope for contributors.

## [2025-08-03 07:24:30 UTC] Decision: Implement CV parsing service
**Context**: Required extracting structured CV data (experience, education, skills) from uploaded files.
**Decision**: Created `CVParser` using OpenAI with a dedicated prompt, added PDF/DOCX text extraction and a `/cv/{id}/parse` endpoint storing raw text and structured JSON.
**Reasoning**: Converts unstructured CV content into database-ready JSON, enabling downstream persona and analysis features.

## [2025-08-03 08:08:01 UTC] Decision: Grouped knowledge base retrieval
**Context**: `/knowledgebase` endpoint returned a flat list and frontend expected `content` fields, diverging from API_SPEC's structured groups.
**Decision**: Returned grouped categories (skills, tools, domains, soft skills, preferences) via `KnowledgeBaseOut`, updated TypeScript utilities and UI to render sections, and added tests verifying clarification answers populate the profile.
**Reasoning**: Structured response aligns API with specification and enables iterative Q&A to build a comprehensive user knowledge base.

## [2025-08-03 09:30:00 UTC] Decision: Implement template management and AI tailoring
**Context**: Needed full template editor with export and AI-assisted tailoring.
**Decision**: Added template schemas, CRUD endpoints, and TailorCopilot service. Frontend now includes template management pages, format selection, and an AI button to generate tailored CV markdown based on persona and job description.
**Reasoning**: Enables users to create and customize export templates, then leverage OpenAI to produce role-specific CVs, fulfilling template editor and auto tailoring features.

## [2025-08-03 10:45:00 UTC] Decision: Mark knowledge base builder complete
**Context**: Knowledge base builder now supports follow-up questions and iterative Q&A.
**Decision**: Marked remaining knowledge base builder tasks as completed in `FEATURES.md`.
**Reasoning**: Keeps feature roadmap in sync with implemented capabilities.
## [2025-08-03 09:00:53 UTC] Decision: Implement team management endpoints
**Context**: Team-related features were outlined in API_SPEC and FEATURES but backend lacked routes and data structures.
**Decision**: Added `TeamInvite` model and Pydantic schemas, implemented `/team` router with member listing, persona aggregation, and invite handling that provisions a team for the inviter when needed. Updated router inclusion and feature checklist.
**Reasoning**: Provides core team workflows—inviting members and viewing collective personas—fulfilling V1.1 team functionality requirements.

## [2025-08-03 09:45:35 UTC] Decision: Build team management UI
**Context**: Backend supported team invites and listings but frontend lacked corresponding pages and components.
**Decision**: Added API utilities for team members, personas, and invitations. Implemented `InviteUserForm`, `TeamMemberList`, and `TeamPersonaTable` components and assembled them in a new `/team` page.
**Reasoning**: Completes end-to-end team features, allowing users to invite members and view team-wide personas from the web app.

## [2025-08-03 10:15:07 UTC] Decision: Add skill taxonomy tagging
**Context**: Knowledge base listed skills without categorization or synonym handling.
**Decision**: Implemented `skill_taxonomy` service to normalize skill synonyms and assign high-level tags. Updated knowledge base endpoint, schemas, frontend types and UI, and added tests. Marked feature checklist accordingly.
**Reasoning**: Provides consistent canonical skill representation and surfaces categorized tags for downstream features and UI clarity.

## [2025-08-03 10:27:42 UTC] Decision: Externalize skill taxonomy
**Context**: Hardcoded synonym and tag mappings required code changes for every new technology.
**Decision**: Moved taxonomy to `api/data/skill_taxonomy.json` and updated the service to load mappings dynamically, defaulting unknown skills to an `Other` tag.
**Reasoning**: A data-driven approach allows extending the taxonomy without touching code and gracefully handles previously unseen skills.

## [2025-08-03 10:36:49 UTC] Decision: Defer skill taxonomy service
**Context**: The taxonomy approach requires further design and isn't ready for production.
**Decision**: Removed service usage and replaced its implementation with a `NotImplementedError` stub.
**Reasoning**: Pausing the feature avoids premature complexity while signaling unfinished functionality if imported.

## [2025-08-03 10:49:57 UTC] Decision: Expand role gap analysis with knowledge base and inline fixes
**Context**: Role-specific gap analysis ignored stored skills and the UI lacked a way to apply AI suggestions.
**Decision**: Included user knowledge base entries in the job match prompt and added an "Apply" button to gap suggestions that patches persona fields.
**Reasoning**: Leveraging the full knowledge base yields richer gap detection while inline actions enable one-click tailoring of personas.

## [2025-08-03 11:27:30 UTC] Decision: Expose persona creation and deletion in dashboard
**Context**: Users could edit personas but had no UI to create new ones or remove existing entries. API payloads also used `title` while the frontend expected `name`.
**Decision**: Added `createPersona` and `deletePersona` helpers that map between `title` and `name`, a `CreatePersonaForm` component, and delete controls on persona cards with dashboard wiring.
**Reasoning**: Restores full persona lifecycle management from the UI and reconciles backend naming differences for consistent edits.

## [2025-08-03 11:27:30 UTC] Decision: Support knowledge base clarifications in gap analysis panel
**Context**: Gap analysis returned clarifying questions but the frontend only displayed them without collecting answers.
**Decision**: Extended `GapAnalysisPanel` with input fields for each question, submission to `/knowledgebase/clarify`, and optional callbacks to refresh data.
**Reasoning**: Enables iterative Q&A to enrich the knowledge base directly from analysis results.

## [2025-08-03 11:27:30 UTC] Decision: Implement team gap analysis UI
**Context**: Backend exposed a team gap analysis endpoint, yet the team page lacked any interface to invoke it.
**Decision**: Added form on `/team` to enter a team description, select multiple personas, and render results via `GapAnalysisPanel` using the `teamGapAnalysis` API.
**Reasoning**: Completes team-level evaluation workflows and allows collaborative assessment of multiple personas against a shared goal.
