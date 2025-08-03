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

export async function getPersonas(): Promise<Persona[]> {
  const res = await fetch(`${API_BASE_URL}/personas`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load personas');
  }
  return res.json();
}

export interface KnowledgeBaseEntry {
  id: number;
  type: string;
  content: string;
}

export async function getKnowledgeBase(): Promise<KnowledgeBaseEntry[]> {
  const res = await fetch(`${API_BASE_URL}/knowledgebase`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load knowledge base');
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
  return res.json();
}

export async function updatePersona(id: string, data: Partial<Persona>): Promise<Persona> {
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update persona');
  }
  return res.json();
}

export interface GapIssue {
  id: string;
  field: string;
  message: string;
}

export async function getGapAnalysis(id: string): Promise<GapIssue[]> {
  const res = await fetch(`${API_BASE_URL}/gap_analysis/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to load gap analysis');
  }
  const data = await res.json();
  return data.issues ?? [];
}

export interface RoleMatchRequest {
  persona_id: string;
  job_description: string;
}

export interface RoleMatchResponse {
  suggestions: string[];
}

export async function roleMatch(req: RoleMatchRequest): Promise<RoleMatchResponse> {
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

export interface ExportResponse {
  url: string;
}

export async function exportPersona(id: string, template: string): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE_URL}/export/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ template }),
  });
  if (!res.ok) {
    throw new Error('Export failed');
  }
  return res.json();
}
