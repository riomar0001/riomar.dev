'use client';

import { useDashboard } from '@/lib/dashboard/context';
import { SectionHeader, ItemActions } from '@/components/dashboard/ui';

export default function ContactSection() {
  const { contactCards, setModal, setEditingItem, setConfirmDelete } = useDashboard();

  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-[1160px] px-6 py-14">
        <SectionHeader index="05" title="Contact Cards" onAdd={() => { setEditingItem(null); setModal('contactCard'); }} addLabel="Add Card" />

        <div className="grid gap-5 sm:grid-cols-3">
          {contactCards.map((card) => (
            <div key={card.id} className="group border border-black/15 p-5 transition-colors hover:border-black/40 dark:border-white/15 dark:hover:border-white/40">
              <div className="mb-3 flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center border border-black/20 dark:border-white/20">
                  {card.iconType === 'location' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  {card.iconType === 'clock' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {card.iconType === 'briefcase' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                </span>
                <ItemActions
                  onEdit={() => { setEditingItem(card as unknown as Record<string, unknown>); setModal('contactCard'); }}
                  onDelete={() => setConfirmDelete({ type: 'contactCard', id: card.id, label: `card "${card.title}"` })}
                />
              </div>
              <h3 className="font-mono text-[11px] tracking-widest uppercase opacity-50">{card.title}</h3>
              <p className="mt-1 text-sm opacity-80">{card.value}</p>
            </div>
          ))}
          <button
            onClick={() => { setEditingItem(null); setModal('contactCard'); }}
            className="flex min-h-[140px] flex-col items-center justify-center gap-2 border border-dashed border-black/25 font-mono text-[11px] tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
            Add Card
          </button>
        </div>
      </div>
    </section>
  );
}
