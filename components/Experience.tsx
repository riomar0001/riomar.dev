import ScrollReveal from '@/components/ui/ScrollReveal';

type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  tags: string[];
  link?: string | null;
};

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <div id="experience" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">04 / Experience</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight mb-7">Where I&apos;ve worked</h2>
        </ScrollReveal>

        {experiences.length === 0 ? (
          <ScrollReveal delay={120}>
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No experience entries yet
            </div>
          </ScrollReveal>
        ) : (
          <div>
            {experiences.map((item, i) => (
              <ScrollReveal key={`${item.role}-${item.company}`} delay={i * 80}>
                <div className="flex flex-wrap gap-2 gap-x-6 py-5 border-t border-black/20 dark:border-white/20">
                  <div className="font-mono text-[13px] opacity-60 basis-[130px] grow-0 shrink-0">{item.period}</div>
                  <div className="grow shrink basis-[280px]">
                    <div className="flex items-baseline gap-3.5 flex-wrap">
                      <h3 className="text-[17px] font-medium">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.role}
                          </a>
                        ) : (
                          item.role
                        )}
                      </h3>
                      <span className="font-mono text-[13px] opacity-55">
                        {item.company} &middot; {item.location}
                      </span>
                    </div>
                    {item.description.map((line, j) => (
                      <p key={j} className="text-[13px] leading-relaxed opacity-75 mt-2 max-w-[660px]">
                        {line}
                      </p>
                    ))}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[11px] opacity-60 border border-black/20 dark:border-white/20 px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
