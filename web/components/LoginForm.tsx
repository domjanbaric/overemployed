import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { login } from '../utils/api';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface p-6 shadow-md dark:bg-surface-dark">
      {error && (
        <p className="text-error dark:text-error-dark" role="alert">
          {error}
        </p>
      )}
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Loading…' : 'Login'}
      </Button>
    </form>
  );
}
