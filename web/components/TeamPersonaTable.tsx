import { Persona } from '../utils/api';

interface Props {
  personas: Persona[];
}

export function TeamPersonaTable({ personas }: Props) {
  if (personas.length === 0) {
    return <p className="text-sm">No personas yet.</p>;
  }
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-surface-dark/5 dark:bg-surface/5">
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Summary</th>
          <th className="p-2 text-left">Tags</th>
        </tr>
      </thead>
      <tbody>
        {personas.map((p, idx) => (
          <tr key={p.id} className={idx % 2 ? 'bg-surface dark:bg-surface-dark' : ''}>
            <td className="p-2 font-medium">{p.name}</td>
            <td className="p-2">{p.summary}</td>
            <td className="p-2">{p.tags?.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
