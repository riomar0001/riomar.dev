import { firaCode } from '@/lib/fonts';

/** Full-screen placeholder shown while the session is being verified. */
export function AuthGate() {
  return (
    <div className={`${firaCode.variable} dashboard-root flex min-h-screen items-center justify-center bg-white text-black dark:bg-black dark:text-white`}>
      <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase opacity-60">
        <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
        Authenticating
      </div>
    </div>
  );
}
