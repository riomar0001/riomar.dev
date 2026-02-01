import Link from 'next/link';
import ScrollAnimation from '../ScrollAnimation';
import BokehBackground from '../bokeh-background';
import ProjectCard from './projects/project-card';

const projects = [
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

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-visible px-6">
      {/* Bokeh background */}
      <BokehBackground />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollAnimation animation="fade-up">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">Featured Projects</h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
        </ScrollAnimation>

        {/* Project cards grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <ProjectCard project={project} />
            </ScrollAnimation>
          ))}
        </div>

        {/* View All Button */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-6 py-3 font-medium text-neutral-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              View All Projects
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollAnimation>

        {/* View more link */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <div className="mt-16 text-center">
            <a
              href="https://github.com/riomar0001"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-neutral-600 transition-all duration-300 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
            >
              <span className="relative">
                View more on GitHub
                <span className="absolute bottom-0 left-0 h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
