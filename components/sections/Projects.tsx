import { ScrollAnimation } from '../ScrollAnimation';
import BokehBackground from '../bokeh-background';

export function Projects() {
  return (
    <section id="projects" className="relative overflow-visible px-6">
      {/* Bokeh background */}
      <BokehBackground />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">Featured Projects</h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        {/* Coming Soon */}
        <ScrollAnimation animation="scale">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-12 text-center dark:border-neutral-800/50 dark:bg-neutral-900/80">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">Coming Soon</h3>
            <p className="max-w-md text-neutral-600 dark:text-neutral-400">
              I&apos;m currently working on some exciting projects. Check back soon to see what I&apos;ve been building!
            </p>
          </div>
        </ScrollAnimation>

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
