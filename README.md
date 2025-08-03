# PersonaForge – AI-Powered CV, Persona & Gap Analysis Platform

PersonaForge is a SaaS platform built to empower:
- 🎯 **Job Seekers** crafting tailored applications
- 🧑‍💻 **Freelancers & Contractors** applying to new gigs
- 🏢 **Agencies** representing teams in project proposals

Users upload CVs (PDF, DOCX), from which our system extracts structured data, performs AI-based gap analysis, builds persistent skill knowledge bases, and enables the creation of multiple tailored "personas" for targeted applications.

## 🧠 Key Concepts

- **Persona**: A customized view of a user's experience, skills, and narrative tailored to a specific role or context (e.g., “Domjan as a Data Scientist” vs. “Domjan as a Consultant”).
- **Knowledge Base**: Structured representation of a user’s experience, skills, and preferences, used to tailor applications and detect missing info.
- **Gap Analysis**: AI-driven process to identify:
  - General missing elements in a CV or profile (e.g., no achievements, vague skills)
  - Specific gaps when matched to a job/project description (e.g., no Kubernetes listed for DevOps gig)

## 🧱 Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic, AWS
- **Frontend**: Next.js, TailwindCSS
- **AI/LLM**: OpenAI, GPT-4, Embedding APIs
- **Infrastructure**: Docker, AWS ECS, S3, Secret Manager

## 📂 Repository Layout

```
.
├── api/                # FastAPI backend
│   ├── routers/        # Auth, CVs, Personas
│   ├── models/         # SQLAlchemy models
│   ├── services/       # CV parsing, AI helpers
│   ├── schemas/        # Pydantic DTOs
├── web/                # Next.js frontend
├── .env.example
├── README.md           # Main .md which describes the project
├── FEATURES.md         # Features grouped by milestone
├── API_SPEC.md         # REST API description
├── DATABASE.md         # Database schema and structure
├── AGENT.md            # Codex agent role and capabilities
├── ARCHITECTURE.md     # High-level architecture overview
├── FRONTEND_OUTLINE.md  # Frontend component structure
├── STYLE_GUIDE.md      # Frontend design and coding standards
├── NOTEBOOK.md        # Codex logs its thoughts & decisions here
```
