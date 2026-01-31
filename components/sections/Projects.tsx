import { ScrollAnimation } from "../ScrollAnimation";

const projects = [
  {
    title: "Project Alpha",
    description:
      "A modern e-commerce platform built with Next.js and Stripe integration. Features real-time inventory management and a seamless checkout experience.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    link: "#",
    github: "#",
  },
  {
    title: "Project Beta",
    description:
      "An AI-powered content management system that helps teams collaborate more effectively. Includes smart suggestions and automated workflows.",
    tags: ["React", "Node.js", "OpenAI", "MongoDB"],
    link: "#",
    github: "#",
  },
  {
    title: "Project Gamma",
    description:
      "A real-time analytics dashboard for tracking business metrics. Beautiful visualizations and custom reporting capabilities.",
    tags: ["TypeScript", "D3.js", "WebSockets", "Redis"],
    link: "#",
    github: "#",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden px-6 py-24">
      {/* Bokeh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bokeh-circle bokeh-lg bokeh-green-2 bokeh-delay-1 absolute left-1/4 top-10" />
        <div className="bokeh-circle bokeh-md bokeh-teal-1 bokeh-delay-2 absolute right-0 top-1/2 translate-x-1/4" />
        <div className="bokeh-circle bokeh-lg bokeh-green-1 bokeh-delay-3 absolute left-0 bottom-20 -translate-x-1/4" />
        <div className="bokeh-circle bokeh-sm bokeh-green-3 bokeh-delay-4 absolute right-1/3 bottom-10" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              Featured Projects
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        {/* Project cards grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <article
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
              >
              {/* Gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/[0.08] to-teal-500/[0.05] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/[0.12] dark:to-teal-500/[0.08]" />

              {/* Action buttons */}
              <div className="absolute right-4 top-4 flex gap-2 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <a
                  href={project.github}
                  className="rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:bg-emerald-500 hover:text-white hover:scale-110 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
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
                  className="rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:bg-emerald-500 hover:text-white hover:scale-110 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                  aria-label="View live demo"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="mb-3 text-lg font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                  {project.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>

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
            </ScrollAnimation>
          ))}
        </div>

        {/* View more link */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <div className="mt-16 text-center">
          <a
            href="https://github.com/riomar0001"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-neutral-600 transition-all duration-300 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
          >
            <span className="relative">
              View more on GitHub
              <span className="absolute bottom-0 left-0 h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
