import { useEffect, useState } from 'react';
import { Template, getTemplates } from '../utils/api';
import { TemplateForm } from '../components/TemplateForm';
import { Button } from '../components/ui/Button';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  function handleSaved(t: Template) {
    setTemplates(prev => {
      const idx = prev.findIndex(p => p.id === t.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = t;
        return copy;
      }
      return [...prev, t];
    });
    setEditing(null);
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Templates</h1>
      <TemplateForm template={editing} onSaved={handleSaved} />
      <ul className="space-y-2">
        {templates.map(t => (
          <li key={t.id} className="flex items-center justify-between rounded-md border p-2">
            <span>{t.name}</span>
            <Button type="button" onClick={() => setEditing(t)}>
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
