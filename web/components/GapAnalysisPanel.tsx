import { GapIssue } from '../utils/api';

interface Props {
  issues: GapIssue[];
}

export function GapAnalysisPanel({ issues }: Props) {
  if (!issues.length) return null;
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Gap Analysis</h3>
      <ul className="space-y-1">
        {issues.map(issue => (
          <li key={issue.id} className="text-sm text-onSurface dark:text-onSurface-dark">
            <span className="font-medium">{issue.field}:</span> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
