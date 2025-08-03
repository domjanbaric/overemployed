import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

const push = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push }),
}));

const loginMock = jest.fn();
jest.mock('../../utils/api', () => ({
  login: (...args: any[]) => loginMock(...args),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    push.mockClear();
    loginMock.mockReset();
    localStorage.clear();
  });

  it('stores token and redirects on success', async () => {
    loginMock.mockResolvedValue({ token: 'abc123' });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
    expect(loginMock).toHaveBeenCalledWith('user@example.com', 'secret');
    expect(localStorage.getItem('token')).toBe('abc123');
  });

  it('shows error message on failure', async () => {
    loginMock.mockRejectedValue(new Error('Invalid'));
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'bad@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid credentials/i);
  });
});
