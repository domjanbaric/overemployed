import { TextareaHTMLAttributes, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  const generatedId = useId();
  const textId = id ?? generatedId;
  return (
    <div>
      <label htmlFor={textId} className="block text-sm font-medium text-onSurface dark:text-onSurface-dark">
        {label}
      </label>
      <textarea
        id={textId}
        className={`mt-1 block w-full rounded-md border border-gray-300 bg-surface p-2 text-onSurface dark:border-gray-600 dark:bg-surface-dark dark:text-onSurface-dark ${className}`}
        {...props}
      />
    </div>
  );
}
