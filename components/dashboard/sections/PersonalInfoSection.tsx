/* eslint-disable @next/next/no-img-element */
'use client';

import { useDashboard } from '@/lib/dashboard/context';

export default function PersonalInfoSection() {
  const { personalInfo, setModal } = useDashboard();

  return (
    <section className="relative overflow-visible px-6 py-16">
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-50">Personal Info</h2>
          <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          <button
            onClick={() => setModal('personalInfo')}
            className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>

        {personalInfo ? (
          <div className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-2 dark:border-neutral-800/50 dark:bg-neutral-900/80">
            <div className="flex gap-4">
              <img
                src={personalInfo.photoUrl ?? '/profile.jpg'}
                alt="Profile"
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-emerald-400/50"
              />

              <div>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{personalInfo.name}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{personalInfo.role}</p>
                <p className="mt-1 text-xs text-neutral-500">{personalInfo.location}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {personalInfo.email}
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {personalInfo.linkedin}
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {personalInfo.github}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-neutral-500 uppercase">Tagline</p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{personalInfo.tagline}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-neutral-500 uppercase">Bio ({personalInfo.bio.length} paragraphs)</p>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{personalInfo.bio[0]}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
            <button onClick={() => setModal('personalInfo')} className="text-sm text-neutral-500 hover:text-emerald-500">
              + Add personal info
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
