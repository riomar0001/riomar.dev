import { AddButton } from './AddButton';

export function SectionHeader({
  index,
  title,
  onAdd,
  addLabel = 'Add'
}: {
  index?: string;
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {index && <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">{index} / {title}</div>}
        <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">{title}</h2>
      </div>
      {onAdd && <AddButton onClick={onAdd} label={addLabel} />}
    </div>
  );
}

export function SubSectionHeader({ title, onAdd, addLabel = 'Add' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-t border-black/15 pt-8 dark:border-white/15">
      <h3 className="font-mono text-xs tracking-widest uppercase opacity-60">{title}</h3>
      {onAdd && <AddButton onClick={onAdd} label={addLabel} />}
    </div>
  );
}
