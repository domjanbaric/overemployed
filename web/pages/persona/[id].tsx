import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EditorPanel } from '../../components/EditorPanel';
import { GapAnalysisPanel } from '../../components/GapAnalysisPanel';
import { TemplateSelector } from '../../components/TemplateSelector';
import { FormatSelector } from '../../components/FormatSelector';
import { ExportButton } from '../../components/ExportButton';
import { getPersona, getGapAnalysis, Persona, GapReport } from '../../utils/api';

export default function PersonaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [persona, setPersona] = useState<Persona | null>(null);
  const [report, setReport] = useState<GapReport>({ issues: [], questions: [], messages: [] });
  const [template, setTemplate] = useState('');
  const [format, setFormat] = useState('md');

  useEffect(() => {
    if (typeof id === 'string') {
      getPersona(id).then(setPersona);
        getGapAnalysis(id)
          .then(setReport)
          .catch(() => setReport({ issues: [], questions: [], messages: [] }));
    }
  }, [id]);

  if (!persona) return <main className="p-8">Loading…</main>;

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">{persona.name}</h1>
      <EditorPanel persona={persona} onUpdated={setPersona} />
      <GapAnalysisPanel
        report={report}
        personaId={persona.id}
        analysisType="cv_analysis"
      />
      <div className="flex items-end gap-4">
        <div className="w-48">
          <TemplateSelector value={template} onChange={setTemplate} />
        </div>
        <div className="w-32">
          <FormatSelector value={format} onChange={setFormat} />
        </div>
        <ExportButton personaId={persona.id} template={template} format={format} />
      </div>
    </main>
  );
}
