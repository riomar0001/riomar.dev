'use client';

import type { DashboardTab, LoginHistory, ShowToast, VisitorStats } from '@/lib/dashboard/types';
import LinksTab from '@/components/dashboard/LinksTab';
import LoginHistoryTab from '@/components/dashboard/LoginHistoryTab';
import VisitorLogTab from '@/components/dashboard/VisitorLogTab';
import ContactSection from '@/components/dashboard/sections/ContactSection';
import ExperienceSection from '@/components/dashboard/sections/ExperienceSection';
import PersonalInfoSection from '@/components/dashboard/sections/PersonalInfoSection';
import ProjectsSection from '@/components/dashboard/sections/ProjectsSection';
import SkillsSection from '@/components/dashboard/sections/SkillsSection';

function ContentTab() {
  return (
    <main className="relative z-10">
      <PersonalInfoSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}

/** Renders the body for the selected header tab. */
export function DashboardTabs({
  activeTab,
  loginHistory,
  visitorStats,
  showToast
}: {
  activeTab: DashboardTab;
  loginHistory: LoginHistory[];
  visitorStats: VisitorStats | null;
  showToast: ShowToast;
}) {
  switch (activeTab) {
    case 'history':
      return <LoginHistoryTab loginHistory={loginHistory} />;
    case 'visitors':
      return <VisitorLogTab stats={visitorStats} />;
    case 'links':
      return <LinksTab showToast={showToast} />;
    case 'content':
      return <ContentTab />;
  }
}
