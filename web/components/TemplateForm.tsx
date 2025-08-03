import { useEffect, useState } from 'react';
import { createTemplate, updateTemplate, Template, TemplatePayload } from '../utils/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface Props {
  template?: Template | null;
  onSaved: (t: Template) => void;
}

export function TemplateForm({ template, onSaved }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('cv');
  const [engine, setEngine] = useState('markdown');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.name);
      setType(template.type);
      setEngine(template.engine);
      setBody(template.config?.template || '');
    }
  }, [template]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: TemplatePayload = {
      name,
      type,
      engine,
      config: { template: body },
    };
    let result: Template;
    if (template) {
      result = await updateTemplate(template.id, payload);
    } else {
      result = await createTemplate(payload);
    }
    onSaved(result);
    if (!template) {
      setName('');
      setBody('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
      <Select label="Type" value={type} onChange={e => setType(e.target.value)}>
        <option value="cv">CV</option>
        <option value="cover_letter">Cover Letter</option>
      </Select>
      <Select label="Engine" value={engine} onChange={e => setEngine(e.target.value)}>
        <option value="markdown">Markdown</option>
        <option value="jinja">Jinja</option>
      </Select>
      <Textarea label="Template" value={body} onChange={e => setBody(e.target.value)} rows={8} required />
      <Button type="submit">{template ? 'Update' : 'Create'} Template</Button>
    </form>
  );
}
