'use client';

type Props = {
  username?: string;
  activeTab: 'content' | 'history' | 'visitors';
  setActiveTab: (tab: 'content' | 'history' | 'visitors') => void;
  onChangePassword: () => void;
  onLogout: () => void;
};

export default function DashboardHeader({ username, activeTab, setActiveTab, onChangePassword, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-50">CMS Dashboard</span>
          {username && (
            <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:block dark:bg-emerald-900/30 dark:text-emerald-400">
              {username}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-neutral-200 bg-neutral-50 p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
            {(['content', 'history', 'visitors'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                {tab === 'history' ? 'Login History' : tab === 'visitors' ? 'Visitors' : tab}
              </button>
            ))}
          </div>
          <a
            href="/"
            target="_blank"
            className="hidden rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition-all hover:border-emerald-300 hover:text-emerald-600 sm:block dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-emerald-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={onChangePassword}
            title="Change Password"
            className="rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition-all hover:border-emerald-300 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-emerald-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>
          <button
            onClick={onLogout}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
