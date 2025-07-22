# 📊 DATABASE.md – Schema Overview for PersonaForge

This document defines the core relational schema for PersonaForge, using SQLAlchemy-style modeling and Postgres as the target RDBMS. Pydantic schemas will mirror these definitions for API validation.

---

## 📅 User

Represents an individual account holder.

```sql
Table: users
- id: UUID (PK)
- email: String (unique)
- password_hash: String
- name: String
- plan: Enum [free, pro, team]
- created_at: DateTime
- team_id: UUID (nullable, FK to teams.id)
```

---

## 📆 Team

Optional container for team/agency plans.

```sql
Table: teams
- id: UUID (PK)
- name: String
- owner_id: UUID (FK to users.id)
```

---

## 📄 CV

Stores uploaded CV files and extracted metadata.

```sql
Table: cvs
- id: UUID (PK)
- user_id: UUID (FK to users.id)
- filename: String
- raw_text: Text
- parsed_json: JSONB
- status: Enum [pending, parsed, failed]
- created_at: DateTime
```

---

## 🌟 Persona

Customized user-facing profile derived from CV/KB.

```sql
Table: personas
- id: UUID (PK)
- user_id: UUID (FK to users.id)
- title: String
- summary: Text
- tags: Array[String]
- data: JSONB  -- structured override (sections, experience, etc.)
- base_cv_id: UUID (nullable, FK to cvs.id)
- created_at: DateTime
- updated_at: DateTime
```

---

## 🧠 GapReport

Stored analysis results for a persona.

```sql
Table: gap_reports
- id: UUID (PK)
- persona_id: UUID (FK to personas.id)
- type: Enum [general, role_specific]
- input_text: Text  -- optional job description
- issues: JSONB     -- list of {field, suggestion, severity}
- created_at: DateTime
```

---

## 📚 Template

Available templates for export.

```sql
Table: templates
- id: UUID (PK)
- name: String
- type: Enum [cv, cover_letter]
- engine: Enum [markdown, jinja]
- config: JSONB  -- style, layout, fields used
```

---

## 🔎 KnowledgeBase (materialized view or virtual)

Derived from CV and clarifications.

```sql
Table: knowledgebase_entries
- id: UUID (PK)
- user_id: UUID (FK to users.id)
- type: Enum [skill, tool, domain, soft_skill, preference]
- value: String
- source: Enum [cv, user_answer, ai_extraction]
```

---

## ⚠️ Notes

* All primary keys use UUIDs
* `created_at` and `updated_at` are UTC timestamps
* Full-text search indexes (TSVECTOR) are expected on `personas`, `cvs`, and `knowledgebase_entries`
* Vector similarity fields (e.g., `embedding` vector) may be added later for pgvector support

---
