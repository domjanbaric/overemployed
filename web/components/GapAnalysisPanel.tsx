import { useState } from 'react';
import { GapReport, updatePersona, clarifyKnowledgeBase } from '../utils/api';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  report: GapReport;
  personaId?: string;
  onClarify?: () => void;
}

export function GapAnalysisPanel({ report, personaId, onClarify }: Props) {
  const [issues, setIssues] = useState(report.issues);
  const [questions, setQuestions] = useState(report.questions);
  const [answers, setAnswers] = useState<string[]>(report.questions.map(() => ''));
  const [submitting, setSubmitting] = useState(false);
  if (!issues.length && !questions.length) return null;

  async function apply(idx: number) {
    if (!personaId) return;
    const issue = issues[idx];
    try {
      await updatePersona(personaId, { [issue.field]: issue.suggestion });
      setIssues(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error(err);
    }
  }

  async function submitAnswers() {
    const payload: Record<string, string> = {};
    answers.forEach((a, i) => {
      if (a.trim()) payload[i.toString()] = a.trim();
    });
    if (Object.keys(payload).length === 0) return;
    setSubmitting(true);
    try {
      await clarifyKnowledgeBase(payload);
      setQuestions([]);
      setAnswers([]);
      onClarify?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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
              {personaId && (
                <button
                  type="button"
                  className="ml-2 text-primary dark:text-primary-dark"
                  onClick={() => apply(idx)}
                >
                  Apply
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {questions.length > 0 && (
        <div className="space-y-2">
          <h4 className="mb-1 font-semibold text-onSurface dark:text-onSurface-dark">Clarifying Questions</h4>
          {questions.map((q, idx) => (
            <Input
              key={idx}
              label={q}
              value={answers[idx]}
              onChange={e =>
                setAnswers(a => {
                  const copy = [...a];
                  copy[idx] = e.target.value;
                  return copy;
                })
              }
            />
          ))}
          <Button type="button" onClick={submitAnswers} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Answers'}
          </Button>
        </div>
      )}
    </div>
  );
}
