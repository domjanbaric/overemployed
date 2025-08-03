import { useState } from 'react';
import { GapReport, updatePersona } from '../utils/api';

interface Props {
  report: GapReport;
  personaId: string;
}

export function GapAnalysisPanel({ report, personaId }: Props) {
  const [issues, setIssues] = useState(report.issues);
  const { questions } = report;
  if (!issues.length && !questions.length) return null;

  async function apply(idx: number) {
    const issue = issues[idx];
    try {
      await updatePersona(personaId, { [issue.field]: issue.suggestion });
      setIssues((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Gap Analysis</h3>
      {issues.length > 0 && (
        <ul className="mb-4 space-y-1">
          {issues.map((issue, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between text-sm text-onSurface dark:text-onSurface-dark"
            >
              <span>
                <span className="font-medium">{issue.field}:</span> {issue.suggestion} ({issue.severity})
              </span>
              <button
                type="button"
                className="ml-2 text-primary dark:text-primary-dark"
                onClick={() => apply(idx)}
              >
                Apply
              </button>
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
