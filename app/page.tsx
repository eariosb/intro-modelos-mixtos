import Link from 'next/link';
import { getAllModules } from '@/lib/courses';
import { AppLayout } from '@/components/AppLayout';

const COURSE_SLUG = 'modelos-mixtos';

export default function HomePage() {
  const modules = getAllModules();
  const firstModule = modules[0];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent-600">
          Estadística · UNAL 
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Introducción a los Modelos Mixtos
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
          Un curso interactivo para aprender modelos lineales mixtos (LMM) y modelos
          lineales mixtos generalizados (GLMM) desde la exploración de datos longitudinales 
          y de medidas repetidas, hasta el diagnóstico y la selección de modelos, 
          con celdas de código R que se ejecutan directamente en el navegador y referencias de código
          equivalentes en SAS. Fundamentado en las notas de clase, libro (Publicado en cojunto con
          el profesor Juan Carlos Correa) y recomendaciones del profesor Juan Carlos Salazar, 
          ambos pertenecientes al Departamento de Estadística de la Universidad Nacional de Colombia, sede Medellín.
        </p>

        {firstModule && (
          <Link
            href={`/cursos/${COURSE_SLUG}/modulos/${firstModule.meta.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            Empezar el curso →
          </Link>
        )}

        <h2 className="mt-12 text-lg font-semibold text-ink-800">Contenido del curso</h2>
        <ul className="mt-4 space-y-3">
          {modules.map((mod, i) => (
            <li key={mod.meta.slug} className="rounded border border-ink-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-ink-900">
                  Módulo {mod.meta.order} · {mod.meta.title}
                </h3>
              </div>
              {mod.meta.subtitle && <p className="mt-1 text-sm text-ink-500">{mod.meta.subtitle}</p>}
              <ul className="mt-2 space-y-1">
                <li>
                  <Link
                    href={`/cursos/${COURSE_SLUG}/modulos/${mod.meta.slug}`}
                    className="text-sm text-accent-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                  >
                    {i + 1}. {mod.meta.title}
                  </Link>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
