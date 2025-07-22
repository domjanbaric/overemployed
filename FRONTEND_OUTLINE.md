# 📁 FRONTEND\_OUTLINE.md – Pages, Components, and Data Contracts

This document outlines the structure of the frontend application for **PersonaForge**, including page routes, reusable components, and the backend API contracts that drive each part of the UI.

---

## 📁 Pages Overview

### `/login`

* **Description**: Auth screen for login
* **Components**: `LoginForm`
* **Data**:

  * `POST /auth/login` → exchange email/password for token

---

### `/signup`

* **Description**: New user registration
* **Components**: `SignupForm`
* **Data**:

  * `POST /auth/signup` → create user
  * `POST /auth/login` → (immediately login after)

---

### `/dashboard`

* **Description**: Overview of all user data (personas, CVs, gaps)
* **Components**:

  * `PersonaCard`
  * `UploadButton`
  * `KnowledgeBaseSummary`
* **Data**:

  * `GET /users/me`
  * `GET /personas`
  * `GET /cv/list` (optional)
  * `GET /knowledgebase` (profile summary)

---

### `/upload`

* **Description**: Upload CV and preview extraction
* **Components**:

  * `UploadButton`
  * `CVParsePreview`
* **Data**:

  * `POST /cv/upload`
  * `GET /cv/{id}` → for preview

---

### `/persona/[id]`

* **Description**: Edit/view a specific persona
* **Components**:

  * `PersonaEditorPanel`
  * `GapAnalysisPanel`
  * `PersonaHeaderEditor`
  * `SkillListEditor`
  * `ExportButton`
* **Data**:

  * `GET /personas/{id}`
  * `PATCH /personas/{id}` → save changes
  * `GET /gap_analysis/{persona_id}` → general feedback
  * `POST /export/{persona_id}` → export as PDF/MD

---

### `/apply/[job_id]` or `/tailor`

* **Description**: Upload job ad and match persona to it
* **Components**:

  * `JobDescriptionInput`
  * `PersonaSelector`
  * `TailoringSuggestions`
* **Data**:

  * `POST /gap_analysis/role_match` → input job + persona
  * `PATCH /personas/{id}` (optional) → accept suggestions

---

### `/team` (V1.1)

* **Description**: View/manage team members and their personas
* **Components**:

  * `TeamMemberList`
  * `InviteUserForm`
  * `TeamPersonaTable`
* **Data**:

  * `GET /team/members`
  * `GET /team/personas`
  * `POST /team/invite`

---

## 🗉 Shared Components

| Component              | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `UploadButton`         | File upload trigger, shows progress                |
| `PersonaCard`          | Summarized view of a persona (name, summary, tags) |
| `EditorPanel`          | Sectioned editor for persona fields                |
| `GapAnalysisPanel`     | Lists AI-detected gaps with suggestions            |
| `TemplateSelector`     | Choose between export formats                      |
| `ExportButton`         | Trigger PDF/Markdown export                        |
| `JobDescriptionInput`  | Upload/paste job ad                                |
| `TailoringSuggestions` | LLM output showing suggested changes               |

---

## 📊 Data Contracts (API usage per page)

| Page            | API Calls                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------- |
| `/dashboard`    | `GET /users/me`, `GET /personas`, `GET /knowledgebase`                                      |
| `/upload`       | `POST /cv/upload`, `GET /cv/{id}`                                                           |
| `/persona/[id]` | `GET /personas/{id}`, `PATCH /personas/{id}`, `GET /gap_analysis/{id}`, `POST /export/{id}` |
| `/apply`        | `POST /gap_analysis/role_match`, `PATCH /personas/{id}`                                     |
| `/team` (v1.1)  | `GET /team/members`, `GET /team/personas`, `POST /team/invite`                              |

---

## ⚙️ Global Data/State Needs

* **Auth token** in headers (JWT or session)
* **User info** (`/users/me`) available in layout
* **Feature flag**: Free vs. Pro (limits personas, exports, tailoring)
