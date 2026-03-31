'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function ProjectsSection() {
  const { projects, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative overflow-visible px-6 py-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeader title="Featured Projects" onAdd={() => { setEditingItem(null); setModal('project'); }} addLabel="Add Project" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
              <div className="relative h-36 w-full overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-12 w-12 text-emerald-300 dark:text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">Featured</span>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{project.title}</h3>
                  <ItemActions
                    onEdit={() => { setEditingItem(project as unknown as Record<string, unknown>); setModal('project'); }}
                    onDelete={() => setConfirmDelete({ type: 'project', id: project.id, label: `project "${project.title}"` })}
                  />
                </div>
                <p className="mb-3 text-xs leading-relaxed text-neutral-600 line-clamp-2 dark:text-neutral-400">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <button
            onClick={() => { setEditingItem(null); setModal('project'); }}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>
      </div>
    </section>
  );
}
