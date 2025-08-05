import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-surface p-4 dark:bg-surface-dark">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block rounded px-2 py-1 text-onSurface hover:bg-surface-hover dark:text-onSurface-dark dark:hover:bg-surface-hover-dark"
          >
            Dashboard
          </Link>
          <Link
            href="/upload"
            className="block rounded px-2 py-1 text-onSurface hover:bg-surface-hover dark:text-onSurface-dark dark:hover:bg-surface-hover-dark"
          >
            Upload CV
          </Link>
          <Link
            href="/templates"
            className="block rounded px-2 py-1 text-onSurface hover:bg-surface-hover dark:text-onSurface-dark dark:hover:bg-surface-hover-dark"
          >
            Templates
          </Link>
          <Link
            href="/team"
            className="block rounded px-2 py-1 text-onSurface hover:bg-surface-hover dark:text-onSurface-dark dark:hover:bg-surface-hover-dark"
          >
            Team
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="bg-surface px-4 py-2 shadow dark:bg-surface-dark">
          <h1 className="text-xl font-bold text-onSurface dark:text-onSurface-dark">PersonaForge</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        <footer className="bg-surface px-4 py-2 text-center text-sm text-onSurface-variant shadow-inner dark:bg-surface-dark dark:text-onSurface-variant-dark">
          &copy; {year} PersonaForge
        </footer>
      </div>
    </div>
  );
}
