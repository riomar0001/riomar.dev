import ScrollReveal from '@/components/ui/ScrollReveal';

type PersonalInfo = { name: string; email: string; linkedin: string; github: string };

export default function Contact({ personalInfo }: { personalInfo: PersonalInfo }) {
  const socialLinks = [
    { label: 'GitHub', href: personalInfo.github },
    { label: 'LinkedIn', href: personalInfo.linkedin },
    { label: 'Email', href: `mailto:${personalInfo.email}` }
  ];

  return (
    <div id="contact" className="relative z-10">
      <div className="max-w-[1160px] mx-auto px-6 pt-12 pb-10 flex flex-col items-start">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-4">07 / Contact</div>
          <h2 className="text-[22px] sm:text-4xl md:text-[42px] font-bold tracking-tight max-w-[900px] mb-6">Let&apos;s work together.</h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black dark:border-white px-7 py-3.5 font-mono text-[13px] tracking-wide mb-7 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors inline-block"
          >
            Get in touch on LinkedIn
          </a>

          <div className="flex gap-6 flex-wrap mt-7">
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="font-mono text-[13px] opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
              >
                {label} &rarr;
              </a>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-12 pt-5 border-t border-black/15 dark:border-white/15 w-full flex justify-between flex-wrap gap-2 font-mono text-[11px] opacity-40">
          <span>&copy; {new Date().getFullYear()} {personalInfo.name}</span>
          <span>Crafted with care.</span>
        </div>
      </div>
    </div>
  );
}
