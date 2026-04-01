export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BokehBackground from '@/components/bokeh-background';
import ProjectCard from '@/components/sections/projects/project-card';
import { prisma } from '@/lib/prisma';
import { projects as staticProjects, personalInfo as staticPersonalInfo } from '@/contents';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Featured projects and portfolio - Software Engineer. Explore web applications, mobile apps, and more.'
};

async function getData() {
  try {
    const [projects, pi] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.personalInfo.findUnique({ where: { id: 'singleton' } })
    ]);
    return { projects, personalInfo: pi };
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const dbData = await getData();

  const projects = dbData?.projects.length
    ? dbData.projects.map((p) => ({
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl ?? undefined,
        tags: p.tags,
        link: p.link ?? '#',
        github: p.github ?? '#'
      }))
    : staticProjects.map((p) => ({ ...p, imageUrl: undefined as undefined }));

  const personalInfo = dbData?.personalInfo
    ? {
        name: dbData.personalInfo.name,
        role: dbData.personalInfo.role,
        email: dbData.personalInfo.email,
        linkedin: dbData.personalInfo.linkedin,
        github: dbData.personalInfo.github,
      }
    : {
        name: staticPersonalInfo.name,
        role: staticPersonalInfo.role,
        email: staticPersonalInfo.email,
        linkedin: staticPersonalInfo.linkedin,
        github: staticPersonalInfo.github,
      };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main>
        <section className="relative overflow-visible px-6 pt-32 pb-24">
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
            {projects.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800/50 dark:bg-neutral-900/80">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">Coming Soon</h3>
                <p className="max-w-md text-neutral-600 dark:text-neutral-400">
                  I&apos;m currently working on some exciting projects. Check back soon!
                </p>
              </div>
            )}

            {/* GitHub link */}
            <div className="mt-16 text-center">
              <a
                href={personalInfo.github}
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
      <Footer personalInfo={personalInfo} />
    </div>
  );
}
