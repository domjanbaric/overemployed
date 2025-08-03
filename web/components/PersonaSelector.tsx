import { Persona } from '../utils/api';
import { Select } from './ui/Select';

interface Props {
  personas: Persona[];
  value: string;
  onChange: (id: string) => void;
}

export function PersonaSelector({ personas, value, onChange }: Props) {
  return (
    <Select label="Persona" value={value} onChange={e => onChange(e.target.value)} required>
      <option value="" disabled>
        Select persona
      </option>
      {personas.map(p => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </Select>
  );
}
