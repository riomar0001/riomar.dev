'use client';

import { EmptyState, TabHeader, TabShell, panelCls } from '@/components/dashboard/ui';
import type { LoginHistory } from '@/lib/dashboard/types';
import { LoginHistoryRow } from '@/components/dashboard/logins/LoginHistoryRow';

export default function LoginHistoryTab({ loginHistory }: { loginHistory: LoginHistory[] }) {
  return (
    <TabShell>
      <TabHeader eyebrow="Security" title="Login History" />

      <div className={panelCls}>
        {loginHistory.length === 0 ? (
          <EmptyState message="No login history yet" />
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {loginHistory.map((entry) => (
              <LoginHistoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </TabShell>
  );
}
