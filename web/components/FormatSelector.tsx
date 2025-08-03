import { Select } from './ui/Select';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function FormatSelector({ value, onChange }: Props) {
  return (
    <Select label="Format" value={value} onChange={e => onChange(e.target.value)} required>
      <option value="md">Markdown</option>
      <option value="pdf">PDF</option>
    </Select>
  );
}
