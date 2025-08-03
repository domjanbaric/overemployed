import { KnowledgeBase } from '../utils/api';

interface Props {
  kb: KnowledgeBase;
}

export function KnowledgeBaseSummary({ kb }: Props) {
  const sections = [
    { title: 'Skills', items: kb.skills },
    { title: 'Tools', items: kb.tools },
    { title: 'Domains', items: kb.domains },
    { title: 'Soft Skills', items: kb.soft_skills },
    { title: 'Preferences', items: kb.preferences },
  ];
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-onSurface dark:text-onSurface-dark">Knowledge Base</h3>
      {sections.map(section => (
        <div key={section.title} className="mb-4 last:mb-0">
          <h4 className="text-md font-medium text-onSurface dark:text-onSurface-dark">{section.title}</h4>
          <ul className="list-disc space-y-1 pl-5">
            {section.items.length > 0 ? (
              section.items.map((item, idx) => (
                <li key={idx} className="text-sm text-onSurface dark:text-onSurface-dark">
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-onSurface dark:text-onSurface-dark opacity-50">None</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
