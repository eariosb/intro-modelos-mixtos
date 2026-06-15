import Link from 'next/link';
import { Logo } from './layout/Logo';

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white px-6 py-6 text-sm text-ink-500">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
            <Logo size={22} />
          </Link>
          <p className="text-xs">
            Material con fines educativos · Licencia{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              CC BY-NC-SA 4.0
            </a>
          </p>
        </div>
        <address className="text-xs leading-relaxed not-italic text-ink-500 sm:text-right">
          <p className="font-medium text-ink-700">Esneider Rios</p>
          <p>Universidad Nacional de Colombia - Sede Medellín</p>
          <p>Facultad de Ciencias · Departamento de Estadística</p>
          <p>2026</p>
        </address>
      </div>
    </footer>
  );
}
