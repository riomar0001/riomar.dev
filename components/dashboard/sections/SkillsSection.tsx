'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function SkillsSection() {
  const { skillGroups, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="mx-auto max-w-[1160px] px-6 py-14">
        <SectionHeader index="02" title="Skills" onAdd={() => { setEditingItem(null); setModal('skill'); }} addLabel="Add Group" />

        {skillGroups.length === 0 ? (
          <button
            onClick={() => { setEditingItem(null); setModal('skill'); }}
            className="flex w-full items-center justify-center border border-dashed border-black/25 p-12 font-mono text-xs tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25"
          >
            + Add your first skill group
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.id} className="group">
                <div className="mb-2.5 flex items-center justify-between border-b border-black/20 pb-2 dark:border-white/20">
                  <h3 className="font-mono text-[11px] tracking-wider uppercase opacity-50">{group.category}</h3>
                  <ItemActions
                    onEdit={() => { setEditingItem(group as unknown as Record<string, unknown>); setModal('skill'); }}
                    onDelete={() => setConfirmDelete({ type: 'skill', id: group.id, label: `skill group "${group.category}"` })}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.id}
                      className="border border-black/30 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-black hover:text-white dark:border-white/30 dark:hover:bg-white dark:hover:text-black"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
