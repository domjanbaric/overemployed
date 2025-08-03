import { useState } from 'react';
import { Persona, updatePersona } from '../utils/api';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';

interface Props {
  persona: Persona;
  onUpdated: (p: Persona) => void;
}

export function EditorPanel({ persona, onUpdated }: Props) {
  const [name, setName] = useState(persona.name);
  const [summary, setSummary] = useState(persona.summary || '');
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePersona(persona.id, { name, summary });
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-onSurface dark:text-onSurface-dark">Edit Persona</h3>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Textarea label="Summary" value={summary} onChange={e => setSummary(e.target.value)} rows={4} />
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save'}
      </Button>
    </form>
  );
}
