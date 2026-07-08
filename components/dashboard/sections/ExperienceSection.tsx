/* eslint-disable @next/next/no-img-element */
'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, SubSectionHeader, ItemActions } from '@/components/dashboard/ui';
import { formatAwardDate } from '@/lib/format';
import { imageCropStyle } from '@/lib/image';

export default function ExperienceSection() {
  const { experiences, achievements, certifications, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="mx-auto max-w-[1160px] px-6 py-14">
        <SectionHeader index="04" title="Experience" onAdd={() => { setEditingItem(null); setModal('experience'); }} addLabel="Add Experience" />

        <div className="space-y-5">
          {experiences.map((exp) => (
            <article key={exp.id} className="group border border-black/15 p-5 transition-colors hover:border-black/40 sm:p-6 dark:border-white/15 dark:hover:border-white/40">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                  <h3 className="font-medium tracking-tight">{exp.role}</h3>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap border border-black/25 px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase opacity-70 dark:border-white/25">{exp.period}</span>
                    <ItemActions
                      onEdit={() => { setEditingItem(exp as unknown as Record<string, unknown>); setModal('experience'); }}
                      onDelete={() => setConfirmDelete({ type: 'experience', id: exp.id, label: `experience at "${exp.company}"` })}
                    />
                  </div>
                </div>
                <p className="font-mono text-xs tracking-wider uppercase opacity-55">{exp.company} · {exp.location}</p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm opacity-70">
                    <span className="mt-2 h-[5px] w-[5px] shrink-0 bg-black dark:bg-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <span key={tag} className="border border-black/25 px-2 py-0.5 font-mono text-[10px] tracking-wide dark:border-white/25">{tag}</span>
                ))}
              </div>
            </article>
          ))}
          {experiences.length === 0 && (
            <button onClick={() => { setEditingItem(null); setModal('experience'); }} className="flex w-full items-center justify-center border border-dashed border-black/25 p-12 font-mono text-xs tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25">
              + Add your first experience
            </button>
          )}
        </div>

        {/* Awards */}
        <div className="mt-14">
          <SubSectionHeader title="Awards & Recognition" onAdd={() => { setEditingItem(null); setModal('achievement'); }} addLabel="Add Award" />
          <div className="grid gap-5 sm:grid-cols-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="group flex flex-col border border-black/15 p-5 transition-colors hover:border-black/40 dark:border-white/15 dark:hover:border-white/40">
                <div className="mb-3 flex items-start justify-between">
                  <span className="font-mono text-xs tracking-widest uppercase opacity-40">★ Award</span>
                  <ItemActions
                    onEdit={() => { setEditingItem(ach as unknown as Record<string, unknown>); setModal('achievement'); }}
                    onDelete={() => setConfirmDelete({ type: 'achievement', id: ach.id, label: `achievement "${ach.title}"` })}
                  />
                </div>
                {ach.imageUrl && (
                  <div className="mb-3 aspect-video w-full overflow-hidden border border-black/15 dark:border-white/15">
                    <img src={ach.imageUrl} alt={ach.title} style={imageCropStyle(ach.imagePosition, ach.imageZoom)} className="h-full w-full object-cover" />
                  </div>
                )}
                <h4 className="text-sm font-medium tracking-tight">{ach.title}</h4>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide opacity-50">{ach.event}{ach.date ? ` · ${formatAwardDate(ach.date)}` : ''}</p>
                <p className="mt-2 text-xs leading-relaxed opacity-65">{ach.description}</p>
              </div>
            ))}
            <button onClick={() => { setEditingItem(null); setModal('achievement'); }} className="flex min-h-[160px] flex-col items-center justify-center gap-2 border border-dashed border-black/25 font-mono text-[11px] tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
              Add Award
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-14">
          <SubSectionHeader title="Certifications" onAdd={() => { setEditingItem(null); setModal('certification'); }} addLabel="Add Cert" />
          <div className="grid gap-5 sm:grid-cols-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="group flex gap-4 border border-black/15 p-5 transition-colors hover:border-black/40 dark:border-white/15 dark:hover:border-white/40">
                {cert.iconUrl ? (
                  <img src={cert.iconUrl} alt={cert.issuer} className="h-12 w-12 shrink-0 border border-black/15 object-contain dark:border-white/15" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/15 font-mono text-[10px] uppercase opacity-40 dark:border-white/15">Cert</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium tracking-tight">{cert.title}</h4>
                    <ItemActions
                      onEdit={() => { setEditingItem(cert as unknown as Record<string, unknown>); setModal('certification'); }}
                      onDelete={() => setConfirmDelete({ type: 'certification', id: cert.id, label: `certification "${cert.title}"` })}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wide opacity-50">{cert.issuer}</p>
                  <p className="mt-2 text-xs leading-relaxed opacity-65">{cert.description}</p>
                  {cert.credlyUrl && <p className="mt-2 truncate font-mono text-[11px] opacity-50">{cert.credlyUrl}</p>}
                </div>
              </div>
            ))}
            <button onClick={() => { setEditingItem(null); setModal('certification'); }} className="flex min-h-[120px] flex-col items-center justify-center gap-2 border border-dashed border-black/25 font-mono text-[11px] tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
              Add Certification
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
