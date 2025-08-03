# Features Breakdown

This document outlines the planned features for PersonaForge, grouped by release phases.

---

## ✅ MVP – Individual Users

### 1. Authentication & User Setup
- [x] Email/password signup
- [ ] OAuth login (Google, GitHub)
- [ ] Tiered accounts (Free, Pro, Team)

### 2. CV Upload & Parsing
- [x] PDF/DOCX support
- [x] Extract: name, title, work history, education, skills, certifications
- [ ] Detect sections using layout + ML/NLP heuristics

### 3. General CV Gap Analysis
- [x] AI analysis of CV for structure and clarity
- [x] Detect vague descriptions, missing dates, unsupported claims
- [x] Feedback generation (e.g., “Add metrics to work history”)

### 4. Knowledge Base Builder
- [x] Ask follow-up questions to user (via UI)
- [x] Store structured data: Skills, Tools, Context, Preferences
- [x] Supports iterative Q&A to complete the profile

### 5. Persona Manager
- [x] Create/edit/delete named personas
- [x] Personas can override core knowledge base (e.g., focus on Research)
- [ ] Track applied posts per persona

### 6. Template Editor
- [x] Select and customize CV & Cover Letter templates
- [x] User-editable sections
- [x] Export as PDF or Markdown

---

## 🌱 V1.1 – Freelancers + Teams

### 7. Team/Agency Accounts
- [x] Invite users to team
- [x] Upload multiple CVs (per member)
- [x] Assign personas per user

### 8. Team Personas
- [x] Collective skill/persona overview
- [x] Apply as a team (e.g., “React + Backend + DevOps combo”)

### 9. Skill Taxonomy + Tags
- [ ] Auto-tag skills
- [ ] Normalize synonyms (e.g., TensorFlow → DL Framework)

---

## 🚀 V2 – Tailored Applications + Recruiters

### 10. Role-Specific Gap Analysis
- [x] Input job description
- [ ] Match against persona + KB
- [x] Show what's missing (e.g., required tech, responsibilities)

### 11. Auto Tailoring
- [x] Suggest edits to CV/persona per role
- [ ] Inline suggestions + one-click changes

### 12. Outcome Tracking
- [ ] Track success per persona
- [ ] Feedback on successful patterns

### 13. Recruiter View (optional)
- [ ] Recruiters can browse (anonymized) public personas
- [ ] Search & match engine (opt-in)

---

