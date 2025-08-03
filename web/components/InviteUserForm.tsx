import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { inviteTeamMember } from '../utils/api';

interface Props {
  onInvited?: () => void;
}

export function InviteUserForm({ onInvited }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await inviteTeamMember(email);
      setEmail('');
      setMessage('Invitation sent');
      onInvited?.();
    } catch {
      setMessage('Failed to send invite');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface p-6 shadow-md dark:bg-surface-dark">
      {message && (
        <p className="text-sm" role="alert">
          {message}
        </p>
      )}
      <Input label="Invite by Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Sending…' : 'Send Invite'}
      </Button>
    </form>
  );
}
