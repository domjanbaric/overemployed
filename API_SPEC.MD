# 🔐 API\_SPEC.md – REST API Contracts for PersonaForge

This document defines the planned API endpoints for the PersonaForge backend, grouped by feature domain. All routes follow REST conventions, use JWT bearer token authentication, and return Pydantic-compatible JSON.

---

## 🌐 AUTH

### `POST /auth/signup`

Register a new user.

* Request: `{ email, password, name }`
* Response: `{ token }`

### `POST /auth/login`

Authenticate and return JWT.

* Request: `{ email, password }`
* Response: `{ token }`

---

## 👤 USERS

### `GET /users/me`

Return profile data for the current user.

* Response: `{ id, name, email, plan, team_id (optional) }`

### `PATCH /users/me`

Update user preferences or info.

* Request: Partial user fields

---

## 📄 CV UPLOADS

### `POST /cv/upload`

Upload a CV (PDF/DOCX) and trigger parsing.

* Request: `multipart/form-data` file upload
* Response: `{ cv_id, status, extracted_data (preview) }`

### `GET /cv/{cv_id}`

Get extracted content from a CV.

* Response: `{ name, email, work_experience, skills, education, raw_text }`

### `GET /cv/list`

List uploaded CVs for current user.

* Response: List of `{ id, filename, created_at }`

---

## 👥 PERSONAS

### `GET /personas`

List all personas for the user.

* Response: List of `{ id, title, summary, tags }`

### `POST /personas`

Create a new persona (from parsed CV or from scratch).

* Request: `{ title, base_cv_id (optional), overrides (optional) }`

### `GET /personas/{id}`

Get full persona profile.

* Response: `{ id, title, sections, skills, work_history, summary, tags }`

### `PATCH /personas/{id}`

Update persona fields.

* Request: Partial persona object

### `DELETE /personas/{id}`

Remove a persona

---

## 🧠 GAP ANALYSIS

### `GET /gap_analysis/{persona_id}`

Run general CV quality and gap analysis.

* Response: `{ issues: [ { field, suggestion, severity } ], questions: string[] }`

### `POST /gap_analysis/role_match`

Run gap analysis between persona and job description.

* Request: `{ persona_id, job_description }`
* Response: `{ issues: [ { field, suggestion, severity } ], questions: string[] }`

### `POST /gap_analysis/team`

Run team gap analysis across multiple personas.

* Request: `{ persona_ids: string[], team_description }`
* Response: `{ issues: [ { field, suggestion, severity } ], questions: string[] }`

---

## 📃 EXPORTS

### `POST /export/{persona_id}`

Export persona to PDF or Markdown.

* Request: `{ format: "pdf" | "md", template_id (optional) }`
* Response: `{ file_url }`

---

## 📜 TEMPLATES

### `GET /templates`

List available CV and cover letter templates.

* Response: List of `{ id, name, format, sample_preview_url }`

### `GET /templates/{id}`

Fetch template config.

---

## 🧳 TEAM MANAGEMENT (V1.1)

### `GET /team/members`

List team members (if user is in a team).

### `GET /team/personas`

List personas across team.

### `POST /team/invite`

Invite a user by email.

* Request: `{ email }`

---

## ⚡ LLM/KNOWLEDGE BASE

### `GET /knowledgebase`

Get structured view of extracted knowledge.

* Response: `{ skills, tools, industries, soft_skills, preferences }`

### `POST /knowledgebase/clarify`

Answer clarifying questions to enrich KB.

* Request: `{ answers: { question_id: answer } }`

---

## ℹ️ METADATA

All endpoints return `200 OK` with `application/json` unless noted. Auth required for all routes except `/auth/*`.

Error format:

```json
{
  "error": {
    "code": "ERR_INVALID_REQUEST",
    "message": "Invalid or missing parameter 'title'"
  }
}
```
