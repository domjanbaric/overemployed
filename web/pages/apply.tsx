import { useEffect, useState } from 'react';
import { JobDescriptionInput } from '../components/JobDescriptionInput';
import { PersonaSelector } from '../components/PersonaSelector';
import { GapAnalysisPanel } from '../components/GapAnalysisPanel';
import {
  getPersonas,
  roleMatch,
  Persona,
  GapReport,
  tailorTemplate,
} from '../utils/api';
import { TemplateSelector } from '../components/TemplateSelector';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

export default function ApplyPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState('');
  const [job, setJob] = useState('');
  const [report, setReport] = useState<GapReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('');
  const [tailored, setTailored] = useState('');
  const [tailoring, setTailoring] = useState(false);

  useEffect(() => {
    getPersonas().then(setPersonas).catch(() => setPersonas([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await roleMatch({ persona_id: selected, job_description: job });
      setReport(res);
    } finally {
      setLoading(false);
    }
  }

  async function handleTailor() {
    if (!selected || !job || !template) return;
    setTailoring(true);
    try {
      const res = await tailorTemplate(template, selected, job);
      setTailored(res.content);
    } finally {
      setTailoring(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Tailor Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <JobDescriptionInput value={job} onChange={setJob} />
        <PersonaSelector personas={personas} value={selected} onChange={setSelected} />
        <TemplateSelector value={template} onChange={setTemplate} />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !selected || !job}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </Button>
          <Button
            type="button"
            onClick={handleTailor}
            disabled={tailoring || !selected || !job || !template}
          >
            {tailoring ? 'Tailoring…' : 'AI Tailor'}
          </Button>
        </div>
      </form>
      <div className="mt-6 space-y-4">
        {report && (
          <GapAnalysisPanel
            report={report}
            personaId={selected}
            analysisType="cv_job_match"
          />
        )}
        {tailored && <Textarea label="Tailored CV" value={tailored} readOnly rows={10} />}
      </div>
    </main>
  );
}
