import type { Toast } from '@/lib/dashboard/types';

export function DashboardToast({ toast }: { toast: Toast | null }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      className={`animate-fade-in-up fixed right-4 bottom-4 z-50 flex items-center gap-2.5 border px-4 py-3 font-mono text-xs tracking-wide shadow-lg ${
        toast.type === 'success'
          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
          : 'border-red-500 bg-red-500 text-white'
      }`}
    >
      <span className="inline-block h-[7px] w-[7px] bg-current opacity-80" />
      {toast.msg}
    </div>
  );
}
