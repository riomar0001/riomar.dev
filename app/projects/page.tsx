// ISR: serve a cached page, refresh from the DB at most once a minute.
// CMS mutations call revalidatePublic() so edits still appear immediately.
export const revalidate = 60;

import { Metadata } from 'next';
import Link from 'next/link';
import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import TrailCard from '@/components/ui/TrailCard';
import { firaCode } from '@/lib/fonts';
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
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl ?? undefined,
        tags: p.tags,
        link: p.link ?? '#',
        github: p.github ?? '#'
      }))
    : staticProjects.map((p, i) => ({ ...p, id: String(i), imageUrl: undefined as string | undefined }));

  const personalInfo = dbData?.personalInfo
    ? {
        name: dbData.personalInfo.name,
        github: dbData.personalInfo.github
      }
    : { name: staticPersonalInfo.name, github: staticPersonalInfo.github };

  return (
    <div className={`${firaCode.variable} site-root bg-white text-black dark:bg-black dark:text-white min-h-screen`}>
      <Background />
      <Navbar />
      <main className="relative z-10">
        <div className="max-w-[1160px] mx-auto px-6 pt-[120px] pb-24">
          <Link
            href="/#work"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            &larr; Back to Home
          </Link>

          <div className="mb-12 border-b border-black/15 dark:border-white/15 pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Projects</h1>
            <p className="max-w-2xl text-[15px] leading-relaxed opacity-75">
              A collection of projects I&apos;ve built, from web applications to mobile apps. Each project represents a
              unique challenge and learning experience.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <TrailCard key={project.id}>
                  <div className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.imageUrl} alt={project.title} className="w-full h-[140px] object-cover block" />
                    ) : (
                      <div className="w-full h-[140px] border-b border-black/15 dark:border-white/15 flex items-center justify-center font-mono text-xs opacity-30">
                        No image
                      </div>
                    )}
                    <a
                      href={project.link ?? project.github ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline block p-5 flex flex-col h-[190px]"
                    >
                      <div className="flex justify-between items-start shrink-0">
                        <span className="font-mono text-xs opacity-50">{String(i + 1).padStart(2, '0')}</span>
                        {project.tags[0] && (
                          <span className="font-mono text-[11px] tracking-wider uppercase border border-current px-2 py-0.5 opacity-70">
                            {project.tags[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base mt-3 mb-2 font-semibold h-10 line-clamp-2">{project.title}</h3>
                      <p className="text-[13px] leading-relaxed opacity-75 h-[60px] line-clamp-3">{project.description}</p>
                    </a>
                  </div>
                </TrailCard>
              ))}
            </div>
          ) : (
            <div className="border border-black/20 dark:border-white/20 p-10 text-center font-mono text-xs opacity-50">
              I&apos;m currently working on some exciting projects. Check back soon!
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
            >
              View more on GitHub &rarr;
            </a>
          </div>

          <div className="mt-16 pt-5 border-t border-black/15 dark:border-white/15 flex justify-between flex-wrap gap-2 font-mono text-[11px] opacity-40">
            <span>&copy; {new Date().getFullYear()} {personalInfo.name}</span>
            <span>Crafted with care.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
