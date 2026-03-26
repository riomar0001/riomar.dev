import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedPassword) {
    throw new Error('ADMIN_SEED_PASSWORD environment variable is required');
  }

  const passwordHash = await bcryptjs.hash(seedPassword, 12);

  // Create or update admin user
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash },
    create: { username: 'admin', passwordHash }
  });

  console.log(`✓ Admin user seeded (id: ${user.id})`);

  // Seed personal info
  await prisma.personalInfo.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'Mario Jr Inguito',
      role: 'Software Engineer',
      tagline:
        'Software Engineer building scalable Web and Mobile Apps. Speaker, Mentor, and Cybersecurity Enthusiast from Davao City, Philippines.',
      bio: [
        "I'm a Software Engineer focused on building secure, scalable web and mobile applications, with hands-on interest in cybersecurity and secure system design. I also mentor fellow students in the College of Computing Education at the University of Mindanao.",
        'With experience leading mobile app development and delivering freelance projects for various clients, I specialize in React ecosystems, modern APIs, cloud deployment, and secure application development. I also have a strong interest in cybersecurity and have competed in national cybersecurity competitions.',
        'I enjoy sharing knowledge through speaking engagements and workshops, including advanced JavaScript mentorship for university interns.'
      ],
      email: 'hireme@riomar.dev',
      linkedin: 'https://linkedin.com/in/marioinguito',
      github: 'https://github.com/riomar0001',
      location: 'Davao City, Philippines'
    }
  });

  console.log('✓ Personal info seeded');

  // Seed skills
  const skillGroups = [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'PHP', 'SQL', 'C#']
    },
    {
      category: 'Frontend',
      items: ['React.js', 'Next.js', 'React Native', 'Expo', 'Tailwind CSS', 'Flutter', 'Svelte']
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express.js', 'FastAPI', 'Prisma ORM', 'Laravel', 'Redis', 'ASP.NET']
    },
    {
      category: 'DevOps & Tools',
      items: ['Docker', 'NGINX', 'Git', 'Linux', 'Azure', 'Google Cloud', 'VMWare', 'Virtual Box']
    }
  ];

  for (let i = 0; i < skillGroups.length; i++) {
    const { category, items } = skillGroups[i];

    const existing = await prisma.skillGroup.findFirst({ where: { category } });
    if (!existing) {
      const group = await prisma.skillGroup.create({
        data: { category, order: i }
      });

      for (let j = 0; j < items.length; j++) {
        await prisma.skillItem.create({
          data: { name: items[j], groupId: group.id, order: j }
        });
      }
    }
  }

  console.log('✓ Skills seeded');

  // Seed experiences
  const experiences = [
    {
      role: 'Frontend Engineer',
      company: 'DurianPy',
      location: 'Davao City, Philippines',
      period: '2025',
      description: [
        'Contributed to the frontend development of the PyCon Davao 2025 website, helping build an engaging and responsive user experience for the Python community event.'
      ],
      tags: ['React.js', 'Next.js', 'Frontend'],
      link: 'https://pycon-davao.durianpy.org/',
      order: 0
    },
    {
      role: 'Core Lead Developer',
      company: 'MooManage',
      location: 'Davao City, Philippines',
      period: 'May 2024 - June 2025',
      description: [
        'Led the full development cycle of an Android mobile app using React Native with Expo, emphasizing rapid iteration, modular architecture, and native-like performance.',
        'Built scalable codebases with expo-router, react-native-paper, and custom hooks, implementing OTP authentication, push notifications, and media uploads integrated with REST APIs.',
        'Overcame complex build and deployment challenges using Expo EAS Build, enabling OTA updates and optimizing performance for Android devices.'
      ],
      tags: ['React Native', 'Expo', 'TypeScript', 'REST APIs'],
      order: 1
    },
    {
      role: 'Freelance Web Developer',
      company: 'Various Clients',
      location: 'Remote',
      period: 'July 2022 - Present',
      description: [
        'Developed responsive full-stack web applications using React.js, Express.js, Prisma ORM, and MySQL, with a strong focus on clean UI/UX and performance optimization.',
        'Integrated authentication, file uploads (Cloudinary, Supabase), and dynamic forms using React Hook Form, Redux Toolkit, and TailwindCSS.',
        'Handled server deployment and domain management on Ubuntu VPS, including NGINX configuration, SSL setup, and CI/CD automation with GitHub Actions and Docker.'
      ],
      tags: ['React.js', 'Node.js', 'Docker', 'NGINX'],
      order: 2
    }
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({ where: { role: exp.role, company: exp.company } });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }

  console.log('✓ Experiences seeded');

  // Seed achievements
  const achievements = [
    {
      title: 'DOST Speaker',
      event: 'START Program - Department of Science and Technology',
      date: 'June 2025',
      description:
        'Delivered a talk on modern front-end development covering HTML5, CSS3, JavaScript (ES6+), ReactJS, UI/UX principles, and responsive design.',
      order: 0
    },
    {
      title: 'Speaker & Mentor',
      event: 'JavaScript for Interns - University of Mindanao',
      date: 'June 2025',
      description:
        'Conducted an advanced JavaScript workshop covering JS internals, async programming, closures, and the event loop for university interns.',
      order: 1
    },
    {
      title: 'Hack4Gov 3 Finalist',
      event: 'DICT Cybersecurity Competition',
      date: 'August - October 2024',
      description:
        'Competed in regionals and selected as wildcard for nationals, tackling web exploitation, network forensics, reverse engineering, and incident response.',
      order: 2
    }
  ];

  for (const ach of achievements) {
    const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!existing) {
      await prisma.achievement.create({ data: ach });
    }
  }

  console.log('✓ Achievements seeded');

  // Seed certifications
  const certifications = [
    {
      title: 'IT Specialist - Databases',
      issuer: 'Certiport / Pearson VUE',
      credlyUrl: 'https://www.credly.com/badges/eecec977-4a92-4fff-a481-000bd0c5594d',
      description: 'Validated expertise in database concepts, design, and SQL query skills.',
      order: 0
    },
    {
      title: 'IT Specialist - Network Security',
      issuer: 'Certiport / Pearson VUE',
      credlyUrl: 'https://www.credly.com/badges/aebb6621-fe9d-495d-a23c-5581d14a034f',
      description: 'Demonstrated proficiency in network security concepts and practices.',
      order: 1
    },
    {
      title: 'IT Specialist - Java',
      issuer: 'Certiport / Pearson VUE',
      credlyUrl: 'https://www.credly.com/badges/1197b342-f8c7-41dc-adf2-e443bd434f41',
      description: 'Demonstrated proficiency in Java programming fundamentals and object-oriented concepts.',
      order: 2
    }
  ];

  for (const cert of certifications) {
    const existing = await prisma.certification.findFirst({ where: { title: cert.title } });
    if (!existing) {
      await prisma.certification.create({ data: cert });
    }
  }

  console.log('✓ Certifications seeded');

  // Seed contact cards
  const contactCards = [
    { title: 'Location', value: 'Davao City, Philippines', iconType: 'location', order: 0 },
    { title: 'Response Time', value: 'Within 24 hours', iconType: 'clock', order: 1 },
    { title: 'Availability', value: 'Open for Projects', iconType: 'briefcase', order: 2 }
  ];

  for (const card of contactCards) {
    const existing = await prisma.contactCard.findFirst({ where: { title: card.title } });
    if (!existing) {
      await prisma.contactCard.create({ data: card });
    }
  }

  console.log('✓ Contact cards seeded');
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
