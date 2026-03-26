import ScrollAnimation from '../ScrollAnimation';
import BokehBackground from '../bokeh-background';
import SkillItem from './about/skill-item';

type SkillGroup = { category: string; items: string[] };

export default function About({ skills, bio }: { skills: SkillGroup[]; bio?: string[] | null }) {
  const bioParagraphs = bio ?? [
    "I'm a Software Engineer focused on building secure, scalable web and mobile applications, with hands-on interest in cybersecurity and secure system design. I also mentor fellow students in the College of Computing Education at the University of Mindanao.",
    'With experience leading mobile app development and delivering freelance projects for various clients, I specialize in React ecosystems, modern APIs, cloud deployment, and secure application development. I also have a strong interest in cybersecurity and have competed in national cybersecurity competitions.',
    'I enjoy sharing knowledge through speaking engagements and workshops, including advanced JavaScript mentorship for university interns.'
  ];

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
            {bioParagraphs.map((para, i) => (
              <ScrollAnimation key={i} animation="fade-right" delay={(i + 1) * 100}>
                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-400">{para}</p>
              </ScrollAnimation>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-6 sm:space-y-8">
            {skills.length === 0 ? (
              <ScrollAnimation animation="fade-left">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-8 text-center dark:border-neutral-800/50 dark:bg-neutral-900/80">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No skills listed yet</p>
                </div>
              </ScrollAnimation>
            ) : (
              skills.map((skillGroup, groupIndex) => (
                <ScrollAnimation key={skillGroup.category} animation="fade-left" delay={groupIndex * 100}>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase sm:mb-3 sm:text-sm dark:text-neutral-400">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {skillGroup.items.map((skill) => (
                        <SkillItem key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
