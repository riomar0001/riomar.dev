import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectModal from '@/components/ui/ProjectModal';

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  link?: string | null;
  github?: string | null;
};

export default function Work({ projects, github }: { projects: Project[]; github: string }) {
  return (
    <div id="work" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">03 / Work</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight mb-7">Featured projects</h2>
        </ScrollReveal>

        {projects.length === 0 ? (
          <ScrollReveal delay={120}>
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No featured projects yet
            </div>
          </ScrollReveal>
        ) : (
          <div>
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 80}>
                <div className="group flex flex-col sm:flex-row gap-5 sm:gap-8 py-6 border-t border-black/20 dark:border-white/20">
                  {/* Image */}
                  <div className="w-full sm:w-[300px] shrink-0">
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full aspect-[16/9] object-cover object-top block border border-black/15 dark:border-white/15 grayscale group-hover:grayscale-0 transition-[filter] duration-500"
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] border border-black/15 dark:border-white/15 flex items-center justify-center font-mono text-[11px] opacity-30">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="grow min-w-0">
                    <h3 className="text-[17px] font-medium">{project.title}</h3>
                    <p className="text-[13px] leading-relaxed opacity-75 mt-2 max-w-[660px] line-clamp-2">{project.description}</p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[11px] opacity-60 border border-black/20 dark:border-white/20 px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <ProjectModal project={project} />
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      {project.github && project.github !== '#' && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
                        >
                          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                          View on GitHub
                        </a>
                      )}
                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
                        >
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M6 3H3v10h10v-3M9.5 2.5h4v4M13 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={200}>
          <div className="mt-8 flex items-center gap-6 flex-wrap">
            <a
              href="/projects"
              className="inline-flex items-center border border-black dark:border-white px-6 py-3 font-mono text-xs tracking-wider uppercase whitespace-nowrap hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              View All Projects &rarr;
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-black dark:border-white px-6 py-3 font-mono text-xs tracking-wider uppercase whitespace-nowrap hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              More on GitHub &rarr;
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
