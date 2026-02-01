// Skills data
export const skills = [
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

export const projects = [
  {
    title: 'Project Alpha',
    description:
      'A modern e-commerce platform built with Next.js and Stripe integration. Features real-time inventory management and a seamless checkout experience.',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    link: '#',
    github: '#'
  },
  {
    title: 'Project Beta',
    description: 'An AI-powered content management system that helps teams collaborate more effectively. Includes smart suggestions and automated workflows.',
    tags: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
    link: '#',
    github: '#'
  },
  {
    title: 'Project Gamma',
    description: 'A real-time analytics dashboard for tracking business metrics. Beautiful visualizations and custom reporting capabilities.',
    tags: ['TypeScript', 'D3.js', 'WebSockets', 'Redis'],
    link: '#',
    github: '#'
  }
];

// Experience data
export const experiences = [
  {
    role: 'Frontend Engineer',
    company: 'DurianPy',
    location: 'Davao City, Philippines',
    period: '2025',
    description: [
      'Contributed to the frontend development of the PyCon Davao 2025 website, helping build an engaging and responsive user experience for the Python community event.'
    ],
    tags: ['React.js', 'Next.js', 'Frontend'],
    link: 'https://pycon-davao.durianpy.org/'
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
    tags: ['React Native', 'Expo', 'TypeScript', 'REST APIs']
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
    tags: ['React.js', 'Node.js', 'Docker', 'NGINX']
  }
];

// Achievements data
export const achievements = [
  {
    title: 'DOST Speaker',
    event: 'START Program - Department of Science and Technology',
    date: 'June 2025',
    description: 'Delivered a talk on modern front-end development covering HTML5, CSS3, JavaScript (ES6+), ReactJS, UI/UX principles, and responsive design.'
  },
  {
    title: 'Speaker & Mentor',
    event: 'JavaScript for Interns - University of Mindanao',
    date: 'June 2025',
    description: 'Conducted an advanced JavaScript workshop covering JS internals, async programming, closures, and the event loop for university interns.'
  },
  {
    title: 'Hack4Gov 3 Finalist',
    event: 'DICT Cybersecurity Competition',
    date: 'August - October 2024',
    description:
      'Competed in regionals and selected as wildcard for nationals, tackling web exploitation, network forensics, reverse engineering, and incident response.'
  }
];

// Certifications data
export const certifications = [
  {
    title: 'IT Specialist - Databases',
    issuer: 'Certiport / Pearson VUE',
    credlyUrl: 'https://www.credly.com/badges/eecec977-4a92-4fff-a481-000bd0c5594d',
    description: 'Validated expertise in database concepts, design, and SQL query skills.'
  },
  {
    title: 'IT Specialist - Java',
    issuer: 'Certiport / Pearson VUE',
    credlyUrl: 'https://www.credly.com/badges/1197b342-f8c7-41dc-adf2-e443bd434f41',
    description: 'Demonstrated proficiency in Java programming fundamentals and object-oriented concepts.'
  }
];

// Contact cards data
export const contactCards = [
  {
    title: 'Location',
    value: 'Davao City, Philippines',
    iconType: 'location' as const
  },
  {
    title: 'Response Time',
    value: 'Within 24 hours',
    iconType: 'clock' as const
  },
  {
    title: 'Availability',
    value: 'Open for Projects',
    iconType: 'briefcase' as const
  }
];

// Personal info
export const personalInfo = {
  name: 'Mario Jr Inguito',
  role: 'Software Engineer',
  tagline: 'Software Engineer building scalable Web and Mobile Apps. Speaker, Mentor, and Cybersecurity Enthusiast from Davao City, Philippines.',
  email: 'hireme@riomar.dev',
  linkedin: 'https://linkedin.com/in/marioinguito',
  github: 'https://github.com/riomar0001',
  location: 'Davao City, Philippines'
};
