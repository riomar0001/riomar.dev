import ScrollAnimation from '../ScrollAnimation';
import { contactCards, personalInfo } from '@/contents';

const icons = {
  location: (
    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clock: (
    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  briefcase: (
    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
};

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-visible px-6 py-24">
      {/* Bokeh background */}
      <div className="pointer-events-none absolute inset-0 overflow-x-clip overflow-y-visible">
        <div className="bokeh-circle bokeh-xl bokeh-green-1 bokeh-delay-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="bokeh-circle bokeh-md bokeh-green-2 bokeh-delay-2 absolute top-20 left-10" />
        <div className="bokeh-circle bokeh-md bokeh-teal-1 bokeh-delay-3 absolute right-10 bottom-20" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Badge */}
        <ScrollAnimation animation="fade-down">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1.5 text-xs text-neutral-600 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm dark:border-neutral-800/80 dark:bg-neutral-900/70 dark:text-neutral-400">
            Get in Touch
          </div>
        </ScrollAnimation>

        {/* Heading */}
        <ScrollAnimation animation="fade-up" delay={100}>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 sm:mb-6 sm:text-3xl md:text-4xl dark:text-neutral-50">
            Let&apos;s Work Together
          </h2>
        </ScrollAnimation>

        {/* Description */}
        <ScrollAnimation animation="fade-up" delay={200}>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-neutral-600 sm:mb-10 sm:text-base md:text-lg dark:text-neutral-400">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!
          </p>
        </ScrollAnimation>

        {/* CTA Buttons */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 sm:h-12 sm:px-8 sm:text-base dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:hover:shadow-white/10"
            >
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {personalInfo.email}
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-6 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white sm:h-12 sm:px-8 sm:text-base dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </ScrollAnimation>

        {/* Contact Cards */}
        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {contactCards.map((card, index) => (
            <ScrollAnimation key={card.title} animation="fade-up" delay={400 + index * 100}>
              <div className="group rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white sm:mb-4 sm:h-12 sm:w-12 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-white">
                  {icons[card.iconType]}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-neutral-900 sm:text-base dark:text-neutral-50">{card.title}</h3>
                <p className="text-xs text-neutral-600 sm:text-sm dark:text-neutral-400">{card.value}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
