// ISR: serve a cached page, refresh from the DB at most once a minute.
// CMS mutations call revalidatePublic() so edits still appear immediately.
export const revalidate = 60;

import { Metadata } from 'next';
import Link from 'next/link';
import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import { firaCode } from '@/lib/fonts';
import { formatAwardDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience, work history, and achievements - Software Engineer.'
};

async function getData() {
  try {
    const [experiences, achievements, pi] = await Promise.all([
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
      prisma.personalInfo.findUnique({ where: { id: 'singleton' } })
    ]);
    return { experiences, achievements, personalInfo: pi };
  } catch {
    return null;
  }
}

export default async function ExperiencePage() {
  const dbData = await getData();

  const experiences = dbData?.experiences ?? [];
  const achievements = dbData?.achievements ?? [];
  const name = dbData?.personalInfo?.name ?? '';

  return (
    <div className={`${firaCode.variable} site-root bg-white text-black dark:bg-black dark:text-white min-h-screen`}>
      <Background />
      <Navbar />
      <main className="relative z-10">
        <div className="max-w-[1160px] mx-auto px-6 pt-[120px] pb-24">
          <Link
            href="/#experience"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            &larr; Back to Home
          </Link>

          <div className="mb-12 border-b border-black/15 dark:border-white/15 pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Experience</h1>
            <p className="max-w-2xl text-[15px] leading-relaxed opacity-75">
              My professional journey, work experience, and notable achievements in software development and technology.
            </p>
          </div>

          {/* Experience cards */}
          {experiences.length === 0 ? (
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No experience listed yet
            </div>
          ) : (
            <div>
              {experiences.map((exp) => (
                <div key={exp.id} className="flex flex-wrap gap-2 gap-x-6 py-6 border-t border-black/20 dark:border-white/20">
                  <div className="font-mono text-[13px] opacity-60 basis-[130px] grow-0 shrink-0">{exp.period}</div>
                  <div className="grow shrink basis-[280px]">
                    <div className="flex items-baseline gap-3.5 flex-wrap">
                      <h2 className="text-[17px] font-medium">{exp.role}</h2>
                      <span className="font-mono text-[13px] opacity-55">
                        {exp.company} &middot; {exp.location}
                      </span>
                    </div>
                    {exp.description.map((item, i) => (
                      <p key={i} className="text-[13px] leading-relaxed opacity-75 mt-2 max-w-[660px]">
                        {item}
                      </p>
                    ))}
                    {exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[11px] opacity-60 border border-black/20 dark:border-white/20 px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Awards & Recognition */}
          {achievements.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-medium tracking-tight mb-7 border-b border-black/15 dark:border-white/15 pb-4">Awards &amp; Recognition</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/20 dark:bg-white/20 border border-black/20 dark:border-white/20">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white dark:bg-black p-5 flex flex-col h-[170px]">
                    <h3 className="text-sm font-semibold mb-1.5">{achievement.title}</h3>
                    <div className="font-mono text-[11px] opacity-55 mb-2">
                      {achievement.event}{achievement.date ? <> &middot; {formatAwardDate(achievement.date)}</> : null}
                    </div>
                    <p className="text-xs leading-relaxed opacity-75 line-clamp-4">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-5 border-t border-black/15 dark:border-white/15 flex justify-between flex-wrap gap-2 font-mono text-[11px] opacity-40">
            <span>&copy; {new Date().getFullYear()} {name}</span>
            <span>Crafted with care.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
