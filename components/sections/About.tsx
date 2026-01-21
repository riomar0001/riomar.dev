const skills = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "PHP", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "React Native", "Tailwind CSS", "Flutter"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "Prisma ORM", "Laravel"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "NGINX", "Git", "Linux", "Azure", "Google Cloud"],
  },
];

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-16 flex items-center gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            About Me
          </h2>
          <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              I&apos;m a Computer Science student at the University of Mindanao
              and a full-stack developer passionate about building scalable web
              and mobile applications. I also mentor fellow students in the
              College of Computing Education.
            </p>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              With experience leading mobile app development and delivering
              freelance projects for various clients, I specialize in React
              ecosystems, modern APIs, and cloud deployment. I also have a
              strong interest in cybersecurity and have competed in national
              cybersecurity competitions.
            </p>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              I enjoy sharing knowledge through speaking engagements and
              workshops, including advanced JavaScript mentorship for university
              interns.
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            {skills.map((skillGroup, groupIndex) => (
              <div key={skillGroup.category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className="animate-scale-in animate-on-load rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                      style={{
                        animationDelay: `${groupIndex * 100 + skillIndex * 50}ms`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
