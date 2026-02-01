export default function ProjectCard({
  project
}: {
  project: {
    title: string;
    description: string;
    tags: string[];
    link: string;
    github: string;
  };
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10">
      {/* Gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/8 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/12 dark:to-teal-500/8" />

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex translate-y-1 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <a
          href={project.github}
          className="rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
          aria-label="View on GitHub"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href={project.link}
          className="rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
          aria-label="View live demo"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
          {project.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
