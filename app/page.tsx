import Footer from '@/components/Footer';
import Header from '@/components/Header';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Experience from '@/components/sections/Experience';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import { prisma } from '@/lib/prisma';
import {
  achievements as staticAchievements,
  certifications as staticCertifications,
  contactCards as staticContactCards,
  experiences as staticExperiences,
  personalInfo as staticPersonalInfo,
  skills as staticSkills
} from '@/contents';

async function getPortfolioData() {
  try {
    const [pi, sg, pr, ex, ac, ce, cc] = await Promise.all([
      prisma.personalInfo.findUnique({ where: { id: 'singleton' } }),
      prisma.skillGroup.findMany({ orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
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
  } catch {
    // DB not available, fall back to static data
    return null;
  }
}

export default async function Home() {
  const dbData = await getPortfolioData();

  // Build props falling back to static content
  const personalInfo = dbData?.personalInfo
    ? {
        name: dbData.personalInfo.name,
        role: dbData.personalInfo.role,
        tagline: dbData.personalInfo.tagline,
        email: dbData.personalInfo.email,
        linkedin: dbData.personalInfo.linkedin,
        github: dbData.personalInfo.github,
        location: dbData.personalInfo.location,
        photoUrl: dbData.personalInfo.photoUrl ?? undefined
      }
    : staticPersonalInfo;

  const bio = dbData?.personalInfo?.bio?.length ? dbData.personalInfo.bio : null;

  const skillGroups = dbData?.skillGroups ?? null;
  const skills = skillGroups
    ? skillGroups.map((g) => ({ category: g.category, items: g.items.map((i) => i.name) }))
    : staticSkills;

  const projects = (dbData?.projects ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl ?? undefined,
    tags: p.tags,
    link: p.link ?? '#',
    github: p.github ?? '#',
    featured: p.featured
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
    : staticExperiences;

  const achievements = dbData?.achievements
    ? dbData.achievements.map((a) => ({
        title: a.title,
        event: a.event,
        date: a.date,
        description: a.description
      }))
    : staticAchievements;

  const certifications = dbData?.certifications
    ? dbData.certifications.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        iconUrl: c.iconUrl ?? undefined,
        credlyUrl: c.credlyUrl ?? undefined,
        description: c.description
      }))
    : staticCertifications;

  const contactCards = dbData?.contactCards
    ? dbData.contactCards.map((c) => ({
        title: c.title,
        value: c.value,
        iconType: c.iconType as 'location' | 'clock' | 'briefcase'
      }))
    : staticContactCards;

  return (
    <div className="bg-background dark:bg-green-950/20 min-h-screen">
      <Header />
      <main>
        <Hero personalInfo={personalInfo} />
        <About skills={skills} bio={bio} />
        <Projects projects={projects} github={personalInfo.github} />
        <Experience experiences={experiences} achievements={achievements} certifications={certifications} />
        <Contact personalInfo={personalInfo} contactCards={contactCards} />
      </main>
      <Footer personalInfo={personalInfo} />
    </div>
  );
}
