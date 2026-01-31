import ScrollAnimation from '../ScrollAnimation';
import BokehBackground from '../bokeh-background';
import { skills } from '@/contents';

export default function About() {
  return (
    <section id="about" className="relative overflow-visible px-6 py-24">
      {/* Bokeh background */}
      <BokehBackground />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-10 flex items-center gap-4 sm:mb-16 sm:gap-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-50">About Me</h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Bio */}
          <div className="space-y-4 sm:space-y-6">
            <ScrollAnimation animation="fade-right" delay={100}>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-400">
                I&apos;m a Software Engineer focused on building secure, scalable web and mobile applications, with hands-on interest in cybersecurity and
                secure system design. I also mentor fellow students in the College of Computing Education at the University of Mindanao.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-right" delay={200}>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-400">
                With experience leading mobile app development and delivering freelance projects for various clients, I specialize in React ecosystems, modern
                APIs, cloud deployment, and secure application development. I also have a strong interest in cybersecurity and have competed in national
                cybersecurity competitions.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-right" delay={300}>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-400">
                I enjoy sharing knowledge through speaking engagements and workshops, including advanced JavaScript mentorship for university interns.
              </p>
            </ScrollAnimation>
          </div>

          {/* Skills */}
          <div className="space-y-6 sm:space-y-8">
            {skills.map((skillGroup, groupIndex) => (
              <ScrollAnimation key={skillGroup.category} animation="fade-left" delay={groupIndex * 100}>
                <div>
                  <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase sm:mb-3 sm:text-sm dark:text-neutral-400">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 sm:px-4 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
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
