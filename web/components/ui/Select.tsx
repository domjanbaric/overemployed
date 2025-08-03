import { SelectHTMLAttributes, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, id, className = '', children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-onSurface dark:text-onSurface-dark">
        {label}
      </label>
      <select
        id={selectId}
        className={`mt-1 block w-full rounded-md border border-gray-300 bg-surface p-2 text-onSurface dark:border-gray-600 dark:bg-surface-dark dark:text-onSurface-dark ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
