import { Select } from './ui/Select';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function TemplateSelector({ value, onChange }: Props) {
  return (
    <Select label="Template" value={value} onChange={e => onChange(e.target.value)} required>
      <option value="markdown">Markdown</option>
      <option value="pdf">PDF</option>
    </Select>
  );
}
