'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function SkillsSection() {
  const { skillGroups, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative overflow-visible px-6 py-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeader title="Skills" onAdd={() => { setEditingItem(null); setModal('skill'); }} addLabel="Add Skill Group" />
        <div className="space-y-4">
          {skillGroups.map((group) => (
            <div key={group.id} className="group relative rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">{group.category}</h3>
                <ItemActions
                  onEdit={() => { setEditingItem(group as unknown as Record<string, unknown>); setModal('skill'); }}
                  onDelete={() => setConfirmDelete({ type: 'skill', id: group.id, label: `skill group "${group.category}"` })}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-transparent">{item.name}</span>
                ))}
              </div>
            </div>
          ))}
          {skillGroups.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
              <button onClick={() => { setEditingItem(null); setModal('skill'); }} className="text-sm text-neutral-500 hover:text-emerald-500">+ Add your first skill group</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
