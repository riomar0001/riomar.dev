/* eslint-disable @next/next/no-img-element */
'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { AddButton } from '@/components/dashboard/ui';

export default function PersonalInfoSection() {
  const { personalInfo, setModal } = useDashboard();

  return (
    <section className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="mx-auto max-w-[1160px] px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">01 / Profile</div>
            <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">Personal Info</h2>
          </div>
          <AddButton onClick={() => setModal('personalInfo')} label="Edit" />
        </div>

        {personalInfo ? (
          <div className="grid gap-8 border border-black/15 p-6 sm:grid-cols-2 dark:border-white/15">
            <div className="flex gap-5">
              <img
                src={personalInfo.photoUrl ?? '/profile.jpg'}
                alt="Profile"
                className="h-24 w-24 shrink-0 border border-black/20 object-cover object-top dark:border-white/20"
              />
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-tight">{personalInfo.name}</p>
                <p className="mt-0.5 font-mono text-xs tracking-wider uppercase opacity-60">{personalInfo.role}</p>
                <p className="mt-2 font-mono text-[11px] opacity-50">{personalInfo.location}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 font-mono text-xs">
              <p className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 tracking-wider uppercase opacity-40">Email</span>
                <span className="truncate opacity-80">{personalInfo.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 tracking-wider uppercase opacity-40">LinkedIn</span>
                <span className="truncate opacity-80">{personalInfo.linkedin}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 tracking-wider uppercase opacity-40">GitHub</span>
                <span className="truncate opacity-80">{personalInfo.github}</span>
              </p>
            </div>

            <div className="border-t border-black/10 pt-4 sm:col-span-2 dark:border-white/10">
              <p className="font-mono text-[11px] tracking-widest uppercase opacity-40">Tagline</p>
              <p className="mt-1.5 text-sm opacity-80">{personalInfo.tagline}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-mono text-[11px] tracking-widest uppercase opacity-40">Bio ({personalInfo.bio.length} paragraphs)</p>
              <p className="mt-1.5 line-clamp-2 text-sm opacity-70">{personalInfo.bio[0]}</p>
            </div>
          </div>
        ) : (
          <EmptyState label="+ Add personal info" onClick={() => setModal('personalInfo')} />
        )}
      </div>
    </section>
  );
}

function EmptyState({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center border border-dashed border-black/25 p-12 font-mono text-xs tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25"
    >
      {label}
    </button>
  );
}
