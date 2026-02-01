import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BokehBackground from '@/components/bokeh-background';
import {experiences, achievements} from '@/contents';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience, work history, and achievements of Mario Jr Inguito - Software Engineer.'
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main>
        <section className="relative overflow-visible px-6 pt-32 pb-24">
          {/* Bokeh background */}
          <BokehBackground />

          <div className="relative mx-auto max-w-5xl">
            {/* Back link */}
            <Link
              href="/#experience"
              className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-emerald-500 dark:text-neutral-400 dark:hover:text-emerald-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            {/* Page header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">Experience</h1>
              <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                My professional journey, work experience, and notable achievements in software development and technology.
              </p>
            </div>

            {/* Experience cards */}
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <article
                  key={index}
                  className="group relative rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-8 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                        {exp.role}
                      </h2>
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
              ))}
            </div>

            {/* Achievements section */}
            <div className="mt-20">
              <div className="mb-10 flex items-center gap-6">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Awards & Recognition</h2>
                <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                      {achievement.event} · {achievement.date}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
