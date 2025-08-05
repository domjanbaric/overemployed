import { useState } from 'react';
import { GapReport, ChatMessage, updatePersona, askGapAnalysis } from '../utils/api';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  report: GapReport;
  analysisType: string;
  personaId?: string;
}

export function GapAnalysisPanel({ report, analysisType, personaId }: Props) {
  const [issues, setIssues] = useState(report.issues);
  const [messages, setMessages] = useState<ChatMessage[]>(report.messages || []);
  const [chat, setChat] = useState<ChatMessage[]>(
    report.questions.map(q => ({ role: 'assistant', content: q })),
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  if (!issues.length && chat.length === 0) return null;

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

  async function send() {
    const userMsg = input.trim();
    if (!userMsg) return;
    setSending(true);
    try {
      const res = await askGapAnalysis({
        analysis_type: analysisType,
        messages,
        user_input: userMsg,
      });
      setIssues(res.issues);
      setMessages(res.messages);
      setChat(prev => [
        ...prev,
        { role: 'user', content: userMsg },
        ...res.questions.map(q => ({ role: 'assistant', content: q })),
      ]);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
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
      <div className="space-y-2">
        <div className="max-h-60 space-y-1 overflow-y-auto">
          {chat.map((m, idx) => (
            <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className="text-sm text-onSurface dark:text-onSurface-dark">
                {m.content}
              </span>
            </div>
          ))}
        </div>
        <Input
          label="Your response"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button type="button" onClick={send} disabled={sending}>
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
