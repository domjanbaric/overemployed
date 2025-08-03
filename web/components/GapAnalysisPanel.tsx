import { GapReport } from '../utils/api';

interface Props {
  report: GapReport;
}

export function GapAnalysisPanel({ report }: Props) {
  const { issues, questions } = report;
  if (!issues.length && !questions.length) return null;
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Gap Analysis</h3>
      {issues.length > 0 && (
        <ul className="mb-4 space-y-1">
          {issues.map((issue, idx) => (
            <li key={idx} className="text-sm text-onSurface dark:text-onSurface-dark">
              <span className="font-medium">{issue.field}:</span> {issue.suggestion} ({issue.severity})
            </li>
          ))}
        </ul>
      )}
      {questions.length > 0 && (
        <div>
          <h4 className="mb-1 font-semibold text-onSurface dark:text-onSurface-dark">Clarifying Questions</h4>
          <ul className="list-disc space-y-1 pl-5">
            {questions.map((q, idx) => (
              <li key={idx} className="text-sm text-onSurface dark:text-onSurface-dark">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
