import { InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-onSurface dark:text-onSurface-dark">
        {label}
      </label>
      <input
        id={inputId}
        className={`mt-1 block w-full rounded-md border border-gray-300 bg-surface p-2 text-onSurface dark:border-gray-600 dark:bg-surface-dark dark:text-onSurface-dark ${className}`}
        {...props}
      />
    </div>
  );
}
