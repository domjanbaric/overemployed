# 📁 FRONTEND\_OUTLINE.md – Pages, Components, and Data Contracts

This document outlines the structure of the frontend application for **PersonaForge**, including page routes, reusable components, and the backend API contracts that drive each part of the UI.

---

## 📁 Pages Overview

### `/login`

* **Description**: Auth screen for login
* **Components**: `LoginForm`
* **Data**:

  * `POST /auth/login` → exchange email/password for token

#### 🎭 Layout Sketch

```
+---------------------------+
|        Login Card        |
| Email  [__________]      |
| Password [__________]    |
| [ Login ]                |
+---------------------------+
```

#### 📆 Primary Actions

* Enter credentials and log in

---

### `/signup`

* **Description**: New user registration
* **Components**: `SignupForm`
* **Data**:

  * `POST /auth/signup` → create user
  * `POST /auth/login` → (immediately login after)

#### 🎭 Layout Sketch

```
+---------------------------+
|        Signup Card       |
| Name     [__________]    |
| Email    [__________]    |
| Password [__________]    |
| [ Create Account ]       |
+---------------------------+
```

#### 📆 Primary Actions

* Register user and log in automatically


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

#### 🎭 Layout Sketch

```
+------------------------------------------------------+
| HeaderBar                                           |
+------------------+  +-----------------------------+ |
| UploadButton     |  | KnowledgeBaseSummary        | |
+------------------+  +-----------------------------+ |
| PersonaCard      | PersonaCard                   | |
| PersonaCard      | PersonaCard                   | |
+------------------------------------------------------+
```

#### 📆 Primary Actions

* Upload CV
* View & manage personas
* Understand profile knowledge

---

### `/upload`

* **Description**: Upload CV and preview extraction
* **Components**:

  * `UploadButton`
  * `CVParsePreview`
* **Data**:

  * `POST /cv/upload`
  * `GET /cv/{id}` → for preview
#### 🎭 Layout Sketch

```
+-------------------------+
| Upload Area (Dropzone) |
+-------------------------+
| CVParsePreview          |
| - Name: Domjan B.       |
| - Experience: ...       |
+-------------------------+
```

#### 📆 Primary Actions

* Upload file
* Confirm extracted info

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

```
+------------------------------+
| Header: Persona Title       |
+------------------------------+
| EditorPanel (tabs/sections) |
| - Summary, Experience, ...   |
+------------------------------+
| GapAnalysisPanel             |
| ExportButton (bottom right)  |
+------------------------------+
```
#### 🎨 Style Notes

* Tabs or vertical sections
* Sections scrollable but sticky top header
* Gap feedback in chatbot style panel (success/warning)


#### 📆 Primary Actions

* Edit persona
* View AI feedback
* Export persona (PDF/MD)

#### 🧠 Codex Use

* Gap suggestions, completion assistance

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
#### 🎭 Layout Sketch

```
+----------------------+  +----------------------+
| JobDescriptionInput  |  | TailoringSuggestions |
+----------------------+  +----------------------+
| PersonaSelector below both panels              |
+------------------------------------------------+
```

#### 🎨 Style Notes

* Responsive: stack vertically on mobile
* Suggestions in card-like callouts

#### 📆 Primary Actions

* Upload/paste job ad
* Select persona
* Accept or edit suggested tailoring

#### 🧠 Codex Use

* Suggests edits to fit job post

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

#### 🎭 Layout Sketch

```
+------------------------+
| Team Overview Header   |
+------------------------+
| InviteUserForm         |
| TeamMemberList         |
+------------------------+
| TeamPersonaTable       |
+------------------------+
```

#### 🎨 Style Notes

* Use `table-auto`, zebra rows
* Forms styled like `SignupForm`

#### 📆 Primary Actions

* Invite team members
* View and filter personas

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

## 🎭 UI & Layout Style Notes

All visual components should be:

* Modular and reusable (never hardcoded layout or styles)
* Responsive with Tailwind breakpoints (`sm`, `md`, `lg`)
* Wrapped in dark/light aware containers (`dark:` prefixed)
* Themed via a central `theme.ts` or Tailwind config module

Use `framer-motion` for entry animations, and `lucide-react` for icon consistency.
