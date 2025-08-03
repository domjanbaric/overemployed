import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getMe,
  getPersonas,
  getKnowledgeBase,
  Persona,
  KnowledgeBase,
} from '../utils/api';
import { UploadButton } from '../components/UploadButton';
import { PersonaCard } from '../components/PersonaCard';
import { KnowledgeBaseSummary } from '../components/KnowledgeBaseSummary';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string>('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [kb, setKb] = useState<KnowledgeBase>({
    skills: [],
    tools: [],
    domains: [],
    soft_skills: [],
    preferences: [],
  });

  useEffect(() => {
    getMe().then(u => setUser(u.name));
    getPersonas().then(setPersonas);
    getKnowledgeBase()
      .then(setKb)
      .catch(() =>
        setKb({
          skills: [],
          tools: [],
          domains: [],
          soft_skills: [],
          preferences: [],
        })
      );
  }, []);

  function handleUploaded(id: string) {
    router.push({ pathname: '/upload', query: { id } });
  }

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Welcome, {user}</h1>
      <div>
        <UploadButton onUploaded={handleUploaded} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <KnowledgeBaseSummary kb={kb} />
        <div className="grid gap-4">
          {personas.map(p => (
            <PersonaCard
              key={p.id}
              persona={p}
              onClick={() => router.push(`/persona/${p.id}`)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
