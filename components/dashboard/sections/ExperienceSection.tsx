'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, SubSectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function ExperienceSection() {
  const { experiences, achievements, certifications, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative overflow-visible px-6 py-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeader title="Experience" onAdd={() => { setEditingItem(null); setModal('experience'); }} addLabel="Add Experience" />
        <div className="space-y-4">
          {experiences.map((exp) => (
            <article key={exp.id} className="group relative rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
              <div className="mb-1 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{exp.role}</h3>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 whitespace-nowrap rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">{exp.period}</span>
                    <ItemActions
                      onEdit={() => { setEditingItem(exp as unknown as Record<string, unknown>); setModal('experience'); }}
                      onDelete={() => setConfirmDelete({ type: 'experience', id: exp.id, label: `experience at "${exp.company}"` })}
                    />
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company} · {exp.location}</p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-transparent">{tag}</span>
                ))}
              </div>
            </article>
          ))}
          {experiences.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
              <button onClick={() => { setEditingItem(null); setModal('experience'); }} className="text-sm text-neutral-500 hover:text-emerald-500">+ Add your first experience</button>
            </div>
          )}
        </div>

        {/* Awards */}
        <div className="mt-16">
          <SubSectionHeader title="Awards & Recognition" onAdd={() => { setEditingItem(null); setModal('achievement'); }} addLabel="Add Award" />
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {achievements.map((ach) => (
              <div key={ach.id} className="group relative rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
                <div className="mb-2 flex items-start justify-between">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <ItemActions
                    onEdit={() => { setEditingItem(ach as unknown as Record<string, unknown>); setModal('achievement'); }}
                    onDelete={() => setConfirmDelete({ type: 'achievement', id: ach.id, label: `achievement "${ach.title}"` })}
                  />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{ach.title}</h4>
                <p className="mt-1 text-xs text-neutral-500">{ach.event} · {ach.date}</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{ach.description}</p>
              </div>
            ))}
            <button onClick={() => { setEditingItem(null); setModal('achievement'); }} className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-800/20 dark:text-neutral-500 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Award
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <SubSectionHeader title="Certifications" onAdd={() => { setEditingItem(null); setModal('certification'); }} addLabel="Add Cert" />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="group relative rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
                <div className="mb-2 flex items-start justify-between">
                  {cert.iconUrl ? (
                    <img src={cert.iconUrl} alt={cert.issuer} className="h-12 w-12 rounded-xl object-contain" />
                  ) : (
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  )}
                  <ItemActions
                    onEdit={() => { setEditingItem(cert as unknown as Record<string, unknown>); setModal('certification'); }}
                    onDelete={() => setConfirmDelete({ type: 'certification', id: cert.id, label: `certification "${cert.title}"` })}
                  />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{cert.title}</h4>
                <p className="mt-1 text-xs text-neutral-500">{cert.issuer}</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{cert.description}</p>
                {cert.credlyUrl && <p className="mt-2 text-xs text-emerald-600 truncate dark:text-emerald-400">{cert.credlyUrl}</p>}
              </div>
            ))}
            <button onClick={() => { setEditingItem(null); setModal('certification'); }} className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-800/20 dark:text-neutral-500 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Certification
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
