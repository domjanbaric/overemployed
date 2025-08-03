import { Textarea } from './ui/Textarea';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function JobDescriptionInput({ value, onChange }: Props) {
  return (
    <Textarea
      label="Job Description"
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={8}
      required
    />
  );
}
