import type { ReactNode } from 'react';
import { getAllModules } from '@/lib/courses';
import { Sidebar } from './Sidebar';
import { MainColumn } from './MainColumn';
import { DynamicCourseBlackboard } from './DynamicCourseBlackboard';
import { RoleAwareBlackboardTrigger } from './RoleAwareBlackboardTrigger';
import { CaptureTrigger } from './CaptureTrigger';
import { CaptureManager } from './CaptureManager';
import { BlackboardBridge } from './BlackboardBridge';

/** Top-level shell: sidebar + main content + footer. */
export function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const modules = getAllModules();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar modules={modules} />
      <MainColumn>{children}</MainColumn>
      <DynamicCourseBlackboard />
      <RoleAwareBlackboardTrigger />
      <CaptureTrigger />
      <CaptureManager />
      <BlackboardBridge />
    </div>
  );
}
