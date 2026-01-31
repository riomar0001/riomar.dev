import { ScrollAnimation } from "../ScrollAnimation";

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
    <section id="about" className="relative overflow-hidden px-6 py-24">
      {/* Bokeh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bokeh-circle bokeh-lg bokeh-green-1 bokeh-delay-1 absolute right-0 top-1/4 translate-x-1/3" />
        <div className="bokeh-circle bokeh-md bokeh-green-2 bokeh-delay-2 absolute left-10 bottom-1/4" />
        <div className="bokeh-circle bokeh-sm bokeh-teal-1 bokeh-delay-3 absolute right-1/4 bottom-10" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              About Me
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Bio */}
          <div className="space-y-6">
            <ScrollAnimation animation="fade-right" delay={100}>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                I&apos;m a Computer Science student at the University of Mindanao
                and a full-stack developer passionate about building scalable web
                and mobile applications. I also mentor fellow students in the
                College of Computing Education.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-right" delay={200}>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                With experience leading mobile app development and delivering
                freelance projects for various clients, I specialize in React
                ecosystems, modern APIs, and cloud deployment. I also have a
                strong interest in cybersecurity and have competed in national
                cybersecurity competitions.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-right" delay={300}>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                I enjoy sharing knowledge through speaking engagements and
                workshops, including advanced JavaScript mentorship for university
                interns.
              </p>
            </ScrollAnimation>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            {skills.map((skillGroup, groupIndex) => (
              <ScrollAnimation key={skillGroup.category} animation="fade-left" delay={groupIndex * 100}>
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
