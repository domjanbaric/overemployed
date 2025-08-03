import { useState } from 'react';
import { createPersona, Persona } from '../utils/api';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';

interface Props {
  onCreated: (p: Persona) => void;
}

export function CreatePersonaForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const persona = await createPersona({ name, summary });
      onCreated(persona);
      setName('');
      setSummary('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Textarea label="Summary" value={summary} onChange={e => setSummary(e.target.value)} rows={3} />
      <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Persona'}</Button>
    </form>
  );
}
