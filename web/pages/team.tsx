import { useEffect, useState } from 'react';
import { InviteUserForm } from '../components/InviteUserForm';
import { TeamMemberList } from '../components/TeamMemberList';
import { TeamPersonaTable } from '../components/TeamPersonaTable';
import {
  getTeamMembers,
  getTeamPersonas,
  teamGapAnalysis,
  User,
  Persona,
  GapReport,
} from '../utils/api';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { GapAnalysisPanel } from '../components/GapAnalysisPanel';

export default function TeamPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [report, setReport] = useState<GapReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  async function load() {
    try {
      const [m, p] = await Promise.all([getTeamMembers(), getTeamPersonas()]);
      setMembers(m);
      setPersonas(p);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    );
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res = await teamGapAnalysis({
        persona_ids: selected,
        team_description: description,
      });
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Team</h1>
      <InviteUserForm onInvited={load} />
      <section>
        <h2 className="mb-2 text-lg font-medium">Members</h2>
        <TeamMemberList members={members} />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-medium">Personas</h2>
        <TeamPersonaTable personas={personas} />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-medium">Team Gap Analysis</h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <Textarea
            label="Team Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
          <div className="space-y-1">
            {personas.map(p => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
          <Button type="submit" disabled={analyzing || selected.length === 0 || !description}>
            {analyzing ? 'Analyzing…' : 'Analyze Team'}
          </Button>
        </form>
        {report && <GapAnalysisPanel report={report} />}
      </section>
    </div>
  );
}
