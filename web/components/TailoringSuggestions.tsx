interface Props {
  suggestions: string[];
}

export function TailoringSuggestions({ suggestions }: Props) {
  if (!suggestions.length) return null;
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Tailoring Suggestions</h3>
      <ul className="list-disc space-y-1 pl-5">
        {suggestions.map((s, i) => (
          <li key={i} className="text-sm text-onSurface dark:text-onSurface-dark">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
