import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '../SignupForm';

const push = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push }),
}));

const signupMock = jest.fn();
jest.mock('../../utils/api', () => ({
  signup: (...args: any[]) => signupMock(...args),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    push.mockClear();
    signupMock.mockReset();
    localStorage.clear();
  });

  it('stores token and redirects on success', async () => {
    signupMock.mockResolvedValue({ token: 'def456' });
    render(<SignupForm />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/^email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
    expect(signupMock).toHaveBeenCalledWith('Jane', 'jane@example.com', 'secret');
    expect(localStorage.getItem('token')).toBe('def456');
  });

  it('shows error message on failure', async () => {
    signupMock.mockRejectedValue(new Error('Invalid'));
    render(<SignupForm />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/^email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/signup failed/i);
  });
});
