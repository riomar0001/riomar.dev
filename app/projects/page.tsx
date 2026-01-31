import { Metadata } from "next";
import Link from "next/link";
import BokehBackground from "@/components/bokeh-background";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: 
Metadata = {
  title: "Projects",
  description:
    "Featured projects and portfolio of Mario Jr Inguito - Software Engineer. Explore web applications, mobile apps, and more.",
};

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

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main>
        <section className="relative overflow-visible px-6 pb-24 pt-32">
          {/* Bokeh background */}
          <BokehBackground />

          <div className="relative mx-auto max-w-5xl">
            {/* Back link */}
            <Link
              href="/#projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-emerald-500 dark:text-neutral-400 dark:hover:text-emerald-400"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>

            {/* Page header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
                Projects
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                A collection of projects I&apos;ve built, from web applications
                to mobile apps. Each project represents a unique challenge and
                learning experience.
              </p>
            </div>

            {/* Project cards grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <article
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
                >
                  {/* Gradient overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/8 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/12 dark:to-teal-500/8" />

                  {/* Action buttons */}
                  <div className="absolute right-4 top-4 flex translate-y-1 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <a
                      href={project.github}
                      className="rounded-full bg-neutral-100/80 p-2.5 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                      aria-label="View on GitHub"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                    <h2 className="mb-3 text-lg font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                      {project.title}
                    </h2>
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
              ))}
            </div>

            {/* GitHub link */}
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
