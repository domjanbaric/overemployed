export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://backend:8000';

export interface TokenResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json();
}

export async function signup(name: string, email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    throw new Error('Signup failed');
  }
  return res.json();
}

function authHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load user');
  }
  return res.json();
}

export interface Persona {
  id: string;
  name: string;
  summary?: string;
  tags?: string[];
}

function mapPersona(p: any): Persona {
  return {
    id: p.id,
    name: p.name ?? p.title,
    summary: p.summary,
    tags: p.tags,
  };
}

export async function getPersonas(): Promise<Persona[]> {
  const res = await fetch(`${API_BASE_URL}/personas`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load personas');
  }
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapPersona) : [];
}

export interface KnowledgeBase {
  skills: string[];
  tools: string[];
  domains: string[];
  soft_skills: string[];
  preferences: string[];
}

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  const res = await fetch(`${API_BASE_URL}/knowledgebase`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load knowledge base');
  }
  return res.json();
}

export interface KBEntry {
  id: string;
  type: string;
  value: string;
  source: string;
}

export async function clarifyKnowledgeBase(
  answers: Record<string, string>,
): Promise<KBEntry[]> {
  const res = await fetch(`${API_BASE_URL}/knowledgebase/clarify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    throw new Error('Failed to submit answers');
  }
  return res.json();
}

export interface CVUploadResponse {
  id: string;
}

export async function uploadCV(file: File): Promise<CVUploadResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/cv/upload`, {
    method: 'POST',
    headers: { ...authHeader() },
    body: form,
  });
  if (!res.ok) {
    throw new Error('Upload failed');
  }
  return res.json();
}

export interface CVData {
  id: string;
  name: string;
  data: any;
}

export async function getCV(id: string): Promise<CVData> {
  const res = await fetch(`${API_BASE_URL}/cv/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load CV');
  }
  return res.json();
}

export async function getPersona(id: string): Promise<Persona> {
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load persona');
  }
  const data = await res.json();
  return mapPersona(data);
}

export async function updatePersona(id: string, data: Partial<Persona>): Promise<Persona> {
  const payload: any = { ...data };
  if (payload.name) {
    payload.title = payload.name;
    delete payload.name;
  }
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update persona');
  }
  const updated = await res.json();
  return mapPersona(updated);
}

export interface PersonaPayload {
  name: string;
  summary?: string;
  tags?: string[];
  base_cv_id?: string;
}

export async function createPersona(data: PersonaPayload): Promise<Persona> {
  const payload: any = {
    title: data.name,
    summary: data.summary,
    tags: data.tags,
    base_cv_id: data.base_cv_id,
  };
  const res = await fetch(`${API_BASE_URL}/personas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create persona');
  }
  const created = await res.json();
  return mapPersona(created);
}

export async function deletePersona(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to delete persona');
  }
}

export interface GapIssue {
  field: string;
  suggestion: string;
  severity: string;
}

export interface GapReport {
  issues: GapIssue[];
  questions: string[];
}

export async function getGapAnalysis(id: string): Promise<GapReport> {
  const res = await fetch(`${API_BASE_URL}/gap_analysis/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load gap analysis');
  }
  return res.json();
}

export interface RoleMatchRequest {
  persona_id: string;
  job_description: string;
}

export async function roleMatch(req: RoleMatchRequest): Promise<GapReport> {
  const res = await fetch(`${API_BASE_URL}/gap_analysis/role_match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze role');
  }
  return res.json();
}

export interface TeamGapRequest {
  persona_ids: string[];
  team_description: string;
}

export async function teamGapAnalysis(req: TeamGapRequest): Promise<GapReport> {
  const res = await fetch(`${API_BASE_URL}/gap_analysis/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze team');
  }
  return res.json();
}

export async function getTeamMembers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/team/members`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load team members');
  }
  return res.json();
}

export async function getTeamPersonas(): Promise<Persona[]> {
  const res = await fetch(`${API_BASE_URL}/team/personas`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load team personas');
  }
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapPersona) : [];
}

export async function inviteTeamMember(email: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/team/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new Error('Failed to send invite');
  }
}

export interface ExportResponse {
  url: string;
}

export async function exportPersona(id: string, format: string, templateId: string): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE_URL}/export/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ format, template_id: templateId }),
  });
  if (!res.ok) {
    throw new Error('Export failed');
  }
  return res.json();
}

export interface Template {
  id: string;
  name: string;
  type: string;
  engine: string;
  config: any;
}

export async function getTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_BASE_URL}/templates`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load templates');
  }
  return res.json();
}

export interface TemplatePayload {
  name: string;
  type: string;
  engine: string;
  config: any;
}

export async function createTemplate(data: TemplatePayload): Promise<Template> {
  const res = await fetch(`${API_BASE_URL}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create template');
  }
  return res.json();
}

export async function updateTemplate(id: string, data: Partial<TemplatePayload>): Promise<Template> {
  const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update template');
  }
  return res.json();
}

export async function tailorTemplate(
  templateId: string,
  personaId: string,
  jobDescription: string,
): Promise<{ content: string }> {
  const res = await fetch(`${API_BASE_URL}/templates/${templateId}/tailor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ persona_id: personaId, job_description: jobDescription }),
  });
  if (!res.ok) {
    throw new Error('Failed to tailor template');
  }
  return res.json();
}
