import BokehBackground from "../bokeh-background";
import { ScrollAnimation } from "../ScrollAnimation";

const experiences = [
  {
    role: "Core Lead Developer",
    company: "MooManage",
    location: "Davao City, Philippines",
    period: "May 2024 - June 2025",
    description: [
      "Led the full development cycle of an Android mobile app using React Native with Expo, emphasizing rapid iteration, modular architecture, and native-like performance.",
      "Built scalable codebases with expo-router, react-native-paper, and custom hooks, implementing OTP authentication, push notifications, and media uploads integrated with REST APIs.",
      "Overcame complex build and deployment challenges using Expo EAS Build, enabling OTA updates and optimizing performance for Android devices.",
    ],
    tags: ["React Native", "Expo", "TypeScript", "REST APIs"],
  },
  {
    role: "Freelance Web Developer",
    company: "Various Clients",
    location: "Remote",
    period: "July 2022 - Present",
    description: [
      "Developed responsive full-stack web applications using React.js, Express.js, Prisma ORM, and MySQL, with a strong focus on clean UI/UX and performance optimization.",
      "Integrated authentication, file uploads (Cloudinary, Supabase), and dynamic forms using React Hook Form, Redux Toolkit, and TailwindCSS.",
      "Handled server deployment and domain management on Ubuntu VPS, including NGINX configuration, SSL setup, and CI/CD automation with GitHub Actions and Docker.",
    ],
    tags: ["React.js", "Node.js", "Docker", "NGINX"],
  },
];

const achievements = [
  {
    title: "DOST Speaker",
    event: "START Program - Department of Science and Technology",
    date: "June 2025",
    description: "Delivered a talk on modern front-end development covering HTML5, CSS3, JavaScript (ES6+), ReactJS, UI/UX principles, and responsive design.",
  },
  {
    title: "Speaker & Mentor",
    event: "JavaScript for Interns - University of Mindanao",
    date: "June 2025",
    description: "Conducted an advanced JavaScript workshop covering JS internals, async programming, closures, and the event loop for university interns.",
  },
  {
    title: "Hack4Gov 3 Finalist",
    event: "DICT Cybersecurity Competition",
    date: "August - October 2024",
    description: "Competed in regionals and selected as wildcard for nationals, tackling web exploitation, network forensics, reverse engineering, and incident response.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative overflow-visible px-6 py-24">
      {/* Bokeh background */}
      <BokehBackground />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              Experience
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        {/* Experience cards */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <ScrollAnimation key={index} animation="fade-up" delay={index * 150}>
              <article
                className="group relative rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10 sm:p-8"
              >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                    {exp.role}
                  </h3>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                    {exp.company} · {exp.location}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  {exp.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-3 text-neutral-600 dark:text-neutral-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              </article>
            </ScrollAnimation>
          ))}
        </div>

        {/* Achievements section */}
        <div className="mt-20">
          <ScrollAnimation animation="fade-up">
            <div className="mb-10 flex items-center gap-6">
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Awards & Recognition
              </h3>
              <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
            </div>
          </ScrollAnimation>

          <div className="grid gap-6 sm:grid-cols-3">
            {achievements.map((achievement, index) => (
              <ScrollAnimation key={index} animation="scale" delay={index * 100}>
                <div
                  className="group rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
                >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                  {achievement.title}
                </h4>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                  {achievement.event} · {achievement.date}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {achievement.description}
                </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
