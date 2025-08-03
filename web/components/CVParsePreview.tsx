import { CVData } from '../utils/api';

interface Props {
  cv: CVData | null;
}

export function CVParsePreview({ cv }: Props) {
  if (!cv) return null;
  return (
    <div className="mt-4 rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Parsed CV</h3>
      <pre className="whitespace-pre-wrap text-sm text-onSurface dark:text-onSurface-dark">
        {JSON.stringify(cv.data, null, 2)}
      </pre>
    </div>
  );
}
