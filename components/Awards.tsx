import ScrollReveal from '@/components/ui/ScrollReveal';
import { formatAwardDate, awardDateValue } from '@/lib/format';
import { imageCropStyle } from '@/lib/image';

type Achievement = { title: string; event: string; date?: string | null; description: string; imageUrl?: string | null; imagePosition?: string | null; imageZoom?: number | null; link?: string | null };

export default function Awards({ achievements }: { achievements: Achievement[] }) {
  // Sort by year then date, most recent first; awards without a date go last.
  const sorted = [...achievements].sort((a, b) => {
    const av = awardDateValue(a.date);
    const bv = awardDateValue(b.date);
    return av === bv ? 0 : bv > av ? 1 : -1;
  });

  return (
    <div id="awards" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-290 mx-auto px-6 py-10">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">05 / Awards</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight mb-7">Awards &amp; recognition</h2>
        </ScrollReveal>

        {achievements.length === 0 ? (
          <ScrollReveal delay={120}>
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No awards listed yet
            </div>
          </ScrollReveal>
        ) : (
          <div>
            {sorted.map((award, i) => (
              <ScrollReveal key={award.title} delay={i * 80}>
                <div className="group flex flex-col sm:flex-row gap-5 sm:gap-8 py-6 border-t border-black/20 dark:border-white/20">
                  {/* Image */}
                  <div className="w-full sm:w-[300px] shrink-0">
                    {award.imageUrl ? (
                      <div className="w-full aspect-[16/9] overflow-hidden border border-black/15 dark:border-white/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={award.imageUrl}
                          alt={award.title}
                          style={imageCropStyle(award.imagePosition, award.imageZoom)}
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/9] border border-black/15 dark:border-white/15 flex items-center justify-center font-mono text-xs opacity-30">
                        &#9733;
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="grow min-w-0">
                    <div className="font-mono text-[11px] tracking-wider uppercase opacity-55 mb-1.5">
                      {award.event}{award.date ? <> &middot; {formatAwardDate(award.date)}</> : null}
                    </div>
                    <h3 className="text-[17px] font-medium">
                      {award.link ? (
                        <a href={award.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {award.title}
                        </a>
                      ) : (
                        award.title
                      )}
                    </h3>
                    <p className="text-[13px] leading-relaxed opacity-75 mt-2 max-w-[660px]">{award.description}</p>
                    {award.link && (
                      <a
                        href={award.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
                      >
                        View &rarr;
                      </a>
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
