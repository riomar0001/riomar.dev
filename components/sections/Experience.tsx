import Link from 'next/link';
import { ScrollAnimation } from '../ScrollAnimation';
import BokehBackground from '../bokeh-background';
import { experiences, achievements, certifications } from '@/data';

export function Experience() {
  return (
    <section id="experience" className="relative overflow-visible px-6 py-24">
      {/* Bokeh background */}
      <BokehBackground />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-10 flex items-center gap-4 sm:mb-16 sm:gap-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-50">Experience</h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        {/* Experience cards */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <ScrollAnimation key={index} animation="fade-up" delay={index * 150}>
              <article className="group relative rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 md:p-8 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 sm:text-lg md:text-xl dark:text-neutral-50 dark:group-hover:text-emerald-400">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  <span className="shrink-0 self-start rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-600 sm:px-3 sm:py-1 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                    {exp.period}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-600 sm:gap-3 sm:text-base dark:text-neutral-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 sm:mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white sm:px-3 sm:py-1 sm:text-xs dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </ScrollAnimation>
          ))}
        </div>

        {/* View All Button */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/experience"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-6 py-3 font-medium text-neutral-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              View My Experiences
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </ScrollAnimation>

        {/* Achievements section */}
        <div className="mt-14 sm:mt-20">
          <ScrollAnimation animation="fade-up">
            <div className="mb-8 flex items-center gap-4 sm:mb-10 sm:gap-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl dark:text-neutral-50">Awards & Recognition</h3>
              <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
            </div>
          </ScrollAnimation>

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {achievements.map((achievement, index) => (
              <ScrollAnimation key={index} animation="scale" delay={index * 100}>
                <div className="group rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10">
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:mb-3 sm:h-10 sm:w-10 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 sm:text-base dark:text-neutral-50 dark:group-hover:text-emerald-400">
                    {achievement.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-500">
                    {achievement.event} · {achievement.date}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:mt-3 sm:text-sm dark:text-neutral-400">{achievement.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>

        {/* Certifications section */}
        <div className="mt-14 sm:mt-20">
          <ScrollAnimation animation="fade-up">
            <div className="mb-8 flex items-center gap-4 sm:mb-10 sm:gap-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl dark:text-neutral-50">Certifications</h3>
              <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
            </div>
          </ScrollAnimation>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {certifications.map((cert, index) => (
              <ScrollAnimation key={index} animation="scale" delay={index * 100}>
                <a
                  href={cert.credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
                >
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:mb-3 sm:h-10 sm:w-10 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 sm:text-base dark:text-neutral-50 dark:group-hover:text-emerald-400">
                    {cert.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-500">{cert.issuer}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-neutral-600 sm:mt-3 sm:text-sm dark:text-neutral-400">{cert.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors group-hover:text-emerald-500 sm:mt-4 sm:text-sm dark:text-emerald-400">
                    View on Credly
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
