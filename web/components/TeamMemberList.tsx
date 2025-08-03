import { User } from '../utils/api';

interface Props {
  members: User[];
}

export function TeamMemberList({ members }: Props) {
  if (members.length === 0) {
    return <p className="text-sm">No members yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {members.map(m => (
        <li key={m.id} className="rounded bg-surface p-4 shadow dark:bg-surface-dark">
          <p className="font-medium">{m.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{m.email}</p>
        </li>
      ))}
    </ul>
  );
}
