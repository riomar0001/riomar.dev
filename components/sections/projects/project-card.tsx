type Project = {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  link: string;
  github: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10">
      {/* Gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/8 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/12 dark:to-teal-500/8" />

      {/* Project image or placeholder */}
      <div className="relative h-40 w-full overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-emerald-300 dark:text-emerald-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-1.5 text-xs text-emerald-400/60 dark:text-emerald-700">No preview</p>
            </div>
          </div>
        )}

        {/* Action buttons on image */}
        <div className="absolute top-3 right-3 flex translate-y-1 gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {project.github && project.github !== '#' && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-emerald-500 dark:hover:text-white"
              aria-label="View on GitHub"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          )}
          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-emerald-500 dark:hover:text-white"
              aria-label="View live demo"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
          {project.title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 line-clamp-3 dark:text-neutral-400">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
