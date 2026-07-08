// ISR: serve a cached page, refresh from the DB at most once a minute.
// CMS mutations call revalidatePublic() so edits still appear immediately.
export const revalidate = 60;

import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Awards from '@/components/Awards';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import { firaCode } from '@/lib/fonts';
import { prisma } from '@/lib/prisma';

async function getPortfolioData() {
  try {
    const [pi, sg, pr, ex, ac, ce, cc] = await Promise.all([
      prisma.personalInfo.findUnique({ where: { id: 'singleton' } }),
      prisma.skillGroup.findMany({ orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.project.findMany({ where: { featured: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
      prisma.certification.findMany({ orderBy: { order: 'asc' } }),
      prisma.contactCard.findMany({ orderBy: { order: 'asc' } })
    ]);

    return {
      personalInfo: pi ?? null,
      skillGroups: sg.length > 0 ? sg : null,
      projects: pr,
      experiences: ex.length > 0 ? ex : null,
      achievements: ac.length > 0 ? ac : null,
      certifications: ce.length > 0 ? ce : null,
      contactCards: cc.length > 0 ? cc : null
    };
  } catch (error) {
    console.error('[DB] Failed to fetch portfolio data:', error);
    // DB not available, fall back to static data
    return null;
  }
}

export default async function Home() {
  const dbData = await getPortfolioData();

  // All content comes from the CMS; sections render their empty states when the DB has nothing.
  const personalInfo = dbData?.personalInfo
    ? {
        name: dbData.personalInfo.name,
        role: dbData.personalInfo.role,
        tagline: dbData.personalInfo.tagline,
        email: dbData.personalInfo.email,
        linkedin: dbData.personalInfo.linkedin,
        github: dbData.personalInfo.github,
        location: dbData.personalInfo.location,
        photoUrl: dbData.personalInfo.photoUrl ?? undefined,
        photoPosition: dbData.personalInfo.photoPosition ?? undefined,
        photoZoom: dbData.personalInfo.photoZoom ?? undefined
      }
    : { name: '', role: '', tagline: '', email: '', linkedin: '', github: '', location: '' };

  const bio = dbData?.personalInfo?.bio?.length ? dbData.personalInfo.bio : null;

  const skillGroups = dbData?.skillGroups ?? null;
  const skills = skillGroups
    ? skillGroups.map((g) => ({ category: g.category, items: g.items.map((i) => i.name) }))
    : [];

  const projects = (dbData?.projects ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl ?? undefined,
    imagePosition: p.imagePosition ?? undefined,
    imageZoom: p.imageZoom ?? undefined,
    tags: p.tags,
    link: p.link ?? '#',
    github: p.github ?? '#'
  }));

  const experiences = dbData?.experiences
    ? dbData.experiences.map((e) => ({
        role: e.role,
        company: e.company,
        location: e.location,
        period: e.period,
        description: e.description,
        tags: e.tags,
        link: e.link ?? undefined
      }))
    : [];

  const achievements = dbData?.achievements
    ? dbData.achievements.map((a) => ({
        title: a.title,
        event: a.event,
        date: a.date,
        description: a.description,
        imageUrl: a.imageUrl ?? undefined,
        imagePosition: a.imagePosition ?? undefined,
        imageZoom: a.imageZoom ?? undefined,
        link: a.link ?? undefined
      }))
    : [];

  const certifications = dbData?.certifications
    ? dbData.certifications.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        iconUrl: c.iconUrl ?? undefined,
        credlyUrl: c.credlyUrl ?? undefined,
        description: c.description
      }))
    : [];

  const contactCards = dbData?.contactCards
    ? dbData.contactCards.map((c) => ({
        title: c.title,
        value: c.value,
        iconType: c.iconType as 'location' | 'clock' | 'briefcase'
      }))
    : [];

  return (
    <div className={`${firaCode.variable} site-root bg-white text-black dark:bg-black dark:text-white`}>
      <Background />
      <Navbar />
      <main>
        <Hero personalInfo={personalInfo} />
        <About bio={bio} contactCards={contactCards} />
        <Skills skills={skills} />
        <Work projects={projects} github={personalInfo.github} />
        <Experience experiences={experiences} />
        <Awards achievements={achievements} />
        <Certifications certifications={certifications} />
        <Contact personalInfo={personalInfo} />
      </main>
    </div>
  );
}
