import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BokehBackground from '@/components/bokeh-background';
import ProjectCard from '@/components/sections/projects/project-card';
import { projects } from '@/contents';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Featured projects and portfolio of Mario Jr Inguito - Software Engineer. Explore web applications, mobile apps, and more.'
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main>
        <section className="relative overflow-visible px-6 pt-32 pb-24">
          {/* Bokeh background */}
          <BokehBackground />

          <div className="relative mx-auto max-w-5xl">
            {/* Back link */}
            <Link
              href="/#projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-emerald-500 dark:text-neutral-400 dark:hover:text-emerald-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            {/* Page header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">Projects</h1>
              <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                A collection of projects I&apos;ve built, from web applications to mobile apps. Each project represents a unique challenge and learning
                experience.
              </p>
            </div>

            {/* Project cards grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
