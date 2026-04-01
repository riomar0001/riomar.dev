'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function ContactSection() {
  const { contactCards, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative overflow-visible px-6 py-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeader title="Contact Cards" onAdd={() => { setEditingItem(null); setModal('contactCard'); }} addLabel="Add Card" />
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {contactCards.map((card) => (
            <div key={card.id} className="group relative rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50">
              <div className="mb-3 flex items-start justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-transparent">
                  {card.iconType === 'location' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  {card.iconType === 'clock' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {card.iconType === 'briefcase' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                </div>
                <ItemActions
                  onEdit={() => { setEditingItem(card as unknown as Record<string, unknown>); setModal('contactCard'); }}
                  onDelete={() => setConfirmDelete({ type: 'contactCard', id: card.id, label: `card "${card.title}"` })}
                />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{card.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{card.value}</p>
            </div>
          ))}
          <button
            onClick={() => { setEditingItem(null); setModal('contactCard'); }}
            className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-800/20 dark:text-neutral-500 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Card
          </button>
        </div>
      </div>
    </section>
  );
}
