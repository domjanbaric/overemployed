import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark disabled:opacity-50 dark:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark ${className}`}
      {...props}
    />
  );
}
