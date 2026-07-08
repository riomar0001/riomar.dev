/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import ThemeToggle from '@/components/ThemeToggle';

export type DashboardTab = 'content' | 'history' | 'visitors' | 'links';

type Props = {
  username?: string;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onChangePassword: () => void;
  onLogout: () => void;
};

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'history', label: 'Logins' },
  { id: 'visitors', label: 'Visitors' },
  { id: 'links', label: 'Links' }
];

export default function DashboardHeader({ username, activeTab, setActiveTab, onChangePassword, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/15 bg-white/70 backdrop-blur-md dark:border-white/15 dark:bg-black/70">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex items-center gap-3 shrink-0">
          <a href="/" className="font-mono text-[15px] font-medium tracking-wide">riomar.dev/admin_</a>
          {username && (
            <span className="hidden border border-black/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase opacity-60 sm:block dark:border-white/20">
              {username}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <nav className="flex items-center gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-mono text-xs tracking-wider uppercase transition-opacity ${
                  activeTab === tab.id ? 'opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <span className="h-5 w-px bg-black/15 dark:bg-white/15" />

          <ThemeToggle />

          <a
            href="/"
            target="_blank"
            title="View site"
            className="hidden h-9 w-9 items-center justify-center border border-black transition-colors hover:bg-black hover:text-white sm:flex dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={onChangePassword}
            title="Change password"
            className="flex h-9 w-9 items-center justify-center border border-black transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>

          <button
            onClick={onLogout}
            className="border border-black px-3.5 py-2 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
