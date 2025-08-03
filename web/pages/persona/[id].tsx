import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EditorPanel } from '../../components/EditorPanel';
import { GapAnalysisPanel } from '../../components/GapAnalysisPanel';
import { TemplateSelector } from '../../components/TemplateSelector';
import { ExportButton } from '../../components/ExportButton';
import { getPersona, getGapAnalysis, Persona, GapIssue } from '../../utils/api';

export default function PersonaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [persona, setPersona] = useState<Persona | null>(null);
  const [issues, setIssues] = useState<GapIssue[]>([]);
  const [template, setTemplate] = useState('markdown');

  useEffect(() => {
    if (typeof id === 'string') {
      getPersona(id).then(setPersona);
      getGapAnalysis(id).then(setIssues).catch(() => setIssues([]));
    }
  }, [id]);

  if (!persona) return <main className="p-8">Loading…</main>;

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">{persona.name}</h1>
      <EditorPanel persona={persona} onUpdated={setPersona} />
      <GapAnalysisPanel issues={issues} />
      <div className="flex items-end gap-4">
        <div className="w-48">
          <TemplateSelector value={template} onChange={setTemplate} />
        </div>
        <ExportButton personaId={persona.id} template={template} />
      </div>
    </main>
  );
}
