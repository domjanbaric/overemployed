# 🏗 ARCHITECTURE.md – System Architecture Overview

This document describes the system architecture for **PersonaForge** — a SaaS for personalized job/freelance applications, built with FastAPI, SQLAlchemy, OpenAI, and Next.js.

---

## 🧭 System Overview

```plaintext
[ User ] ──▶ [ Next.js Frontend ]
│
▼
[ FastAPI Backend ] ◀────────┐
│         │                 │
▼         ▼                 │
[Postgres]  [S3]         [OpenAI APIs]
▲                         ▲
└───── [Async Tasks] ◀────┘
```

---

## 🧱 Backend Modules (`/api`)

| Module         | Responsibility |
|----------------|----------------|
| `auth/`        | User login/signup, session handling |
| `users/`       | Profile settings, billing tier |
| `cv/`          | Upload/parse CVs, generate profile |
| `personas/`    | Create/update/view persona versions |
| `gap_analysis/`| AI feedback on profile quality and job fit |
| `templates/`   | Manage resume/cover letter templates |
| `export/`      | Export persona to PDF/Markdown |
| `llm/`         | Wrappers for GPT-4, embeddings, etc. |

> All modules use:
> - `services/` for core logic  
> - `models/` for SQLAlchemy  
> - `schemas/` for Pydantic  
> - `deps/` for dependency injection  

---

## 💻 Frontend Structure (`/web`)

| Page/Route         | Description |
|--------------------|-------------|
| `/login`, `/signup`| Auth screens |
| `/dashboard`       | Main user view: personas, gaps, actions |
| `/upload`          | CV upload and parsing preview |
| `/persona/[id]`    | Edit/view individual persona |
| `/apply/[job_id]`  | Auto-tailor a persona to a job |
| `/team` (V1.1)     | Multi-member view for agency accounts |

### Reusable Components

- `UploadButton`
- `PersonaCard`
- `EditorPanel`
- `GapAnalysisPanel`
- `TemplateSelector`

---

## 🔗 Data Flow Examples

### 🔄 CV Upload Flow

```plaintext
Frontend: /upload → file
↓
Backend:
→ [cv_parser] extracts structured fields
→ Stores CV record (UserID, Metadata)
→ Updates KnowledgeBase (skills, work history)
Frontend: /upload → file
↓
Backend:
→ [cv_parser] extracts structured fields
→ Stores CV record (UserID, Metadata)
→ Updates KnowledgeBase (skills, work history)
```
### 🎭 Persona Application Flow
    
```plaintext
Frontend: /apply/[job_id]
↓
Fetch job description (manual or API)
↓
OpenAI calls:
- Compare job vs. persona
- Suggest edits
- Return suggestions + gap warnings
```

---

## 📦 Storage Architecture

| Resource       | Storage |
|----------------|---------|
| CV Files       | S3 (MinIO for dev) |
| Structured Data| PostgreSQL (pgvector planned) |
| Exported Docs  | S3 |
| Temp Embeds    | In-memory cache or DB cache table |

---

## 🧠 LLM Integration Points

| Task                  | Model / API                                 |
|-----------------------|---------------------------------------------|
| CV → profile parser   | GPT-4                                       |
| Gap feedback          | GPT-4 (structured prompt)                   |
| Role-specific match   | Embedding search + GPT reasoning            |
| Follow-up Qs          | OpenAI auto-generates clarification prompts |
| Persona tailoring     | OpenAI-in-the-loop CV editor                |
| Template rendering    | Jinja2 / Markdown pipelines                 |

---

## 🧵 Async & Future Tasks

Planned Celery queue with Redis or AWS SQS for:
- Long-running parsing
- Embedding generation
- Persona auto-tailoring
- Export pipeline (PDF rendering)
- Email/SaaS integrations

---

## 🔐 Roles & Permissions

| Role       | Access Description |
|------------|--------------------|
| Free User  | 1 persona, limited exports, no tailoring |
| Pro User   | Multiple personas, tailoring, full export |
| Team Lead  | Add/manage team members, apply as group |
| Admin      | Internal moderation & billing tools |

Authentication: OAuth2 bearer tokens (JWT), with optional session-based frontend support.

---