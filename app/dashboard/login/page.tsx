/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Background from '@/components/Background';
import { firaCode } from '@/lib/fonts';
import { inputCls, btnPrimaryCls } from '@/components/dashboard/ui';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${firaCode.variable} dashboard-root relative flex min-h-screen items-center justify-center bg-white px-4 text-black dark:bg-black dark:text-white`}>
      <Background />
      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        {/* Title */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase opacity-60">
            <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
            Admin Access
          </div>
          <h1 className="text-3xl font-bold tracking-tight">riomar.dev_</h1>
          <p className="mt-2 text-sm opacity-60">Sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <div className="border border-black/20 p-6 dark:border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block font-mono text-[11px] tracking-wider uppercase opacity-60">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className={inputCls}
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block font-mono text-[11px] tracking-wider uppercase opacity-60">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="border border-red-500 px-3.5 py-2.5 font-mono text-xs text-red-500">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full ${btnPrimaryCls}`}>
              {loading ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center">
          <a href="/" className="font-mono text-[11px] tracking-wider uppercase opacity-50 transition-opacity hover:opacity-100">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
