import type { ReactNode } from 'react';
import { getAllModules } from '@/lib/courses';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

/** Top-level shell: sidebar + main content + footer. */
export function AppLayout({ children }: { children: ReactNode }) {
  const modules = getAllModules();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar modules={modules} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
