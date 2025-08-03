import { Persona } from '../utils/api';

interface PersonaCardProps {
  persona: Persona;
  onClick?: () => void;
}

export function PersonaCard({ persona, onClick }: PersonaCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-gray-300 p-4 shadow-sm hover:bg-surface-hover dark:border-gray-700 dark:hover:bg-surface-hover-dark"
    >
      <h3 className="text-lg font-semibold text-onSurface dark:text-onSurface-dark">{persona.name}</h3>
      {persona.summary && (
        <p className="text-sm text-onSurface-variant dark:text-onSurface-variant-dark">{persona.summary}</p>
      )}
      {persona.tags && (
        <div className="mt-2 flex flex-wrap gap-2">
          {persona.tags.map(tag => (
            <span key={tag} className="rounded bg-primary px-2 py-1 text-xs text-white dark:bg-primary-dark">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
