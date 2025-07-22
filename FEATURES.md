# Features Breakdown

This document outlines the planned features for PersonaForge, grouped by release phases.

---

## ✅ MVP – Individual Users

### 1. Authentication & User Setup
- Email/password signup
- OAuth login (Google, GitHub)
- Tiered accounts (Free, Pro, Team)

### 2. CV Upload & Parsing
- PDF/DOCX support
- Extract: name, title, work history, education, skills, certifications
- Detect sections using layout + ML/NLP heuristics

### 3. General CV Gap Analysis
- AI analysis of CV for structure and clarity
- Detect vague descriptions, missing dates, unsupported claims
- Feedback generation (e.g., “Add metrics to work history”)

### 4. Knowledge Base Builder
- Ask follow-up questions to user (via UI)
- Store structured data: Skills, Tools, Context, Preferences
- Supports iterative Q&A to complete the profile

### 5. Persona Manager
- Create/edit/delete named personas
- Personas can override core knowledge base (e.g., focus on Research)
- Track applied posts per persona

### 6. Template Editor
- Select and customize CV & Cover Letter templates
- User-editable sections
- Export as PDF or Markdown

---

## 🌱 V1.1 – Freelancers + Teams

### 7. Team/Agency Accounts
- Invite users to team
- Upload multiple CVs (per member)
- Assign personas per user

### 8. Team Personas
- Collective skill/persona overview
- Apply as a team (e.g., “React + Backend + DevOps combo”)

### 9. Skill Taxonomy + Tags
- Auto-tag skills
- Normalize synonyms (e.g., TensorFlow → DL Framework)

---

## 🚀 V2 – Tailored Applications + Recruiters

### 10. Role-Specific Gap Analysis
- Input job description
- Match against persona + KB
- Show what's missing (e.g., required tech, responsibilities)

### 11. Auto Tailoring
- Suggest edits to CV/persona per role
- Inline suggestions + one-click changes

### 12. Outcome Tracking
- Track success per persona
- Feedback on successful patterns

### 13. Recruiter View (optional)
- Recruiters can browse (anonymized) public personas
- Search & match engine (opt-in)

---

