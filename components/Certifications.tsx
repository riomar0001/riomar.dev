import TrailCard from '@/components/ui/TrailCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Certification = { title: string; issuer: string; iconUrl?: string | null; credlyUrl?: string | null; description: string };

function CertContent({ cert }: { cert: Certification }) {
  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
          {cert.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.iconUrl}
              alt={cert.issuer}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500"
            />
          ) : (
            <svg
              className="w-5 h-5 text-black opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[11px] tracking-wider uppercase opacity-55 block mb-1">{cert.issuer}</span>
          <h3 className="text-base font-bold line-clamp-2">{cert.title}</h3>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed opacity-75 line-clamp-2">{cert.description}</p>
      {cert.credlyUrl && <span className="mt-auto font-mono text-xs opacity-70">View on Credly &rarr;</span>}
    </>
  );
}

export default function Certifications({ certifications }: { certifications: Certification[] }) {
  return (
    <div id="certifications" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-290 mx-auto px-6 py-10">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">06 / Certifications</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight mb-7">Certifications</h2>
        </ScrollReveal>

        {certifications.length === 0 ? (
          <ScrollReveal delay={120}>
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No certifications listed yet
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={120}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <TrailCard key={cert.title}>
                  {cert.credlyUrl ? (
                    <a
                      href={cert.credlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group no-underline block p-6 flex flex-col h-52 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                    >
                      <CertContent cert={cert} />
                    </a>
                  ) : (
                    <div className="group p-6 flex flex-col h-52 bg-white dark:bg-black border border-black/20 dark:border-white/20">
                      <CertContent cert={cert} />
                    </div>
                  )}
                </TrailCard>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
