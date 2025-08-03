import { useEffect, useState } from 'react';
import { JobDescriptionInput } from '../components/JobDescriptionInput';
import { PersonaSelector } from '../components/PersonaSelector';
import { TailoringSuggestions } from '../components/TailoringSuggestions';
import { getPersonas, roleMatch, Persona } from '../utils/api';
import { Button } from '../components/ui/Button';

export default function ApplyPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState('');
  const [job, setJob] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPersonas().then(setPersonas).catch(() => setPersonas([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await roleMatch({ persona_id: selected, job_description: job });
      setSuggestions(res.suggestions);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Tailor Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <JobDescriptionInput value={job} onChange={setJob} />
        <PersonaSelector personas={personas} value={selected} onChange={setSelected} />
        <Button type="submit" disabled={loading || !selected || !job}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </form>
      <div className="mt-6">
        <TailoringSuggestions suggestions={suggestions} />
      </div>
    </main>
  );
}
