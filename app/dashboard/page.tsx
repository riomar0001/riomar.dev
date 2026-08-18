'use client';

import Background from '@/components/Background';
import { firaCode } from '@/lib/fonts';
import { DashboardContext } from '@/lib/dashboard/context';
import { useDashboardShell } from '@/lib/dashboard/hooks';

import { AuthGate } from '@/components/dashboard/AuthGate';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DashboardToast } from '@/components/dashboard/DashboardToast';
import { DashboardModals } from '@/components/dashboard/modals/DashboardModals';

export default function DashboardPage() {
  const shell = useDashboardShell();

  if (!shell.authChecked) return <AuthGate />;

  return (
    <DashboardContext.Provider value={shell.contextValue}>
      <div className={`${firaCode.variable} dashboard-root relative min-h-screen bg-white text-black dark:bg-black dark:text-white`}>
        <Background />

        <DashboardHeader
          username={shell.user?.username}
          activeTab={shell.activeTab}
          setActiveTab={shell.setActiveTab}
          onChangePassword={shell.openChangePassword}
          onLogout={shell.logout}
        />

        <DashboardTabs
          activeTab={shell.activeTab}
          loginHistory={shell.loginHistory}
          visitorStats={shell.visitorStats}
          showToast={shell.showToast}
        />

        <DashboardModals
          modal={shell.modal}
          editingItem={shell.editingItem}
          confirmDelete={shell.confirmDelete}
          saving={shell.saving}
          showToast={shell.showToast}
          onClose={shell.closeModal}
          onConfirmDelete={shell.confirmDeleteItem}
          onCancelDelete={shell.cancelDelete}
        />

        <DashboardToast toast={shell.toast} />
      </div>
    </DashboardContext.Provider>
  );
}
