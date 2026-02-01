export default function SkillItem({ skill }: { skill: string }) {
  return (
    <span
      key={skill}
      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 sm:px-4 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
    >
      {skill}
    </span>
  );
}
