/**
 * Module page — pure orchestration.
 *
 * This file only wires data to presentation:
 *   resolveModuleData  →  data layer (lib/moduleData)
 *   Module* components →  UI layer (components/module/*)
 *
 * No business logic, no inline JSX, no direct filesystem access.
 */
import { AppLayout } from '@/components/AppLayout';
import { LessonProgressTracker } from '@/components/LessonProgressTracker';
import { ModuleBreadcrumb } from '@/components/module/ModuleBreadcrumb';
import { ModuleHeader } from '@/components/module/ModuleHeader';
import { ObjectivesBox } from '@/components/module/ObjectivesBox';
import { PresentationSync } from '@/components/PresentationSync';
import { RemoteCursor } from '@/components/RemoteCursor';
import { MDXContent } from '@/components/module/MDXContent';
import { ModulePrevNext } from '@/components/module/ModulePrevNext';
import { SessionTracker } from '@/components/SessionTracker';
import { resolveModuleData } from '@/lib/moduleData';
import { COURSE_SLUG } from '@/lib/constants';
import { BlackboardContextBridge } from '@cursos/blackboard';
import type { ModuleContext } from '@cursos/blackboard';

// Re-export from the co-located file — Next.js requires this named export
// to be present in the route file itself.
export { generateStaticParams } from './generateStaticParams';

export default function ModulePage({
  params,
}: {
  params: { course: string; slug: string };
}) {
  const { meta, source, prev, next, objectives } = resolveModuleData(
    params.course,
    params.slug,
  );

  const moduleHref = (slug: string) =>
    `/cursos/${COURSE_SLUG}/modulos/${slug}`;

  const moduleContext: ModuleContext = {
    slug: meta.slug,
    title: meta.title,
    objective: objectives,
    datasets: meta.datasets ?? [],
    order: meta.order,
  };

  return (
    <AppLayout>
      <BlackboardContextBridge context={moduleContext} />
      <SessionTracker slug={meta.slug} title={meta.title} />
      <LessonProgressTracker slug={meta.slug} />
      <PresentationSync />
      <ModuleBreadcrumb title={meta.title} />
      <ModuleHeader
        title={meta.title}
        subtitle={meta.subtitle}
        datasets={meta.datasets}
      />
      <ObjectivesBox objectives={objectives} />
      <MDXContent source={source} />
      <ModulePrevNext prev={prev} next={next} moduleHref={moduleHref} />
      <RemoteCursor />
    </AppLayout>
  );
}
