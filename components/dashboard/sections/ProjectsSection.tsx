/* eslint-disable @next/next/no-img-element */
'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function ProjectsSection() {
  const { projects, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="mx-auto max-w-[1160px] px-6 py-14">
        <SectionHeader index="03" title="Featured Projects" onAdd={() => { setEditingItem(null); setModal('project'); }} addLabel="Add Project" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group flex flex-col border border-black/15 transition-colors hover:border-black/40 dark:border-white/15 dark:hover:border-white/40">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-black/15 dark:border-white/15">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-xs tracking-widest uppercase opacity-25">
                    No image
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-0 left-0 bg-black px-2 py-1 font-mono text-[10px] tracking-wider uppercase text-white dark:bg-white dark:text-black">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-medium tracking-tight">{project.title}</h3>
                  <ItemActions
                    onEdit={() => { setEditingItem(project as unknown as Record<string, unknown>); setModal('project'); }}
                    onDelete={() => setConfirmDelete({ type: 'project', id: project.id, label: `project "${project.title}"` })}
                  />
                </div>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed opacity-65">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="border border-black/25 px-2 py-0.5 font-mono text-[10px] tracking-wide dark:border-white/25">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <button
            onClick={() => { setEditingItem(null); setModal('project'); }}
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 border border-dashed border-black/25 font-mono text-xs tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
            Add Project
          </button>
        </div>
      </div>
    </section>
  );
}
