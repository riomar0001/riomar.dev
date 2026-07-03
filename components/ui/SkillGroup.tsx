export default function SkillGroup({ category, items }: { category: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] tracking-wider uppercase opacity-50 mb-2.5 border-b border-black/20 dark:border-white/20 pb-2">
        {category}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="border border-black/30 dark:border-white/30 px-3 py-1.5 font-mono text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white transition-colors"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
