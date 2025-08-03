import { useEffect, useState } from 'react';
import { getTemplates, Template } from '../utils/api';
import { Select } from './ui/Select';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function TemplateSelector({ value, onChange }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  return (
    <Select label="Template" value={value} onChange={e => onChange(e.target.value)} required>
      <option value="">Select…</option>
      {templates.map(t => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </Select>
  );
}
