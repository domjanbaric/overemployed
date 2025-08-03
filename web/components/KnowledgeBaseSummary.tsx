import { KnowledgeBaseEntry } from '../utils/api';

interface Props {
  entries: KnowledgeBaseEntry[];
}

export function KnowledgeBaseSummary({ entries }: Props) {
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Knowledge Base</h3>
      <ul className="list-disc space-y-1 pl-5">
        {entries.map(e => (
          <li key={e.id} className="text-sm text-onSurface dark:text-onSurface-dark">
            {e.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
