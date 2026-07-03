import ScrollReveal from '@/components/ui/ScrollReveal';

type ContactCard = { title: string; value: string; iconType: string };

const FALLBACK_BIO = [
  "I'm a Software Engineer focused on building secure, scalable web and mobile applications, with hands-on interest in cybersecurity and secure system design. I also mentor fellow students in the College of Computing Education at the University of Mindanao.",
  'I specialize in React ecosystems, modern APIs, cloud deployment, and secure application development, and have competed in national cybersecurity competitions.'
];

export default function About({ bio, contactCards }: { bio: string[] | null; contactCards: ContactCard[] }) {
  const paragraphs = bio?.length ? bio : FALLBACK_BIO;

  return (
    <div id="about" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-290 mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">01 / About</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight">Who I am</h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`text-[15px] leading-relaxed opacity-85 max-w-[680px] ${i === paragraphs.length - 1 ? 'mb-5' : 'mb-3'}`}
            >
              {para}
            </p>
          ))}

          {contactCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-black/20 dark:border-white/20 max-w-[520px]">
              {contactCards.map((card, i) => (
                <div
                  key={card.title}
                  className={[
                    'p-3.5',
                    i < contactCards.length - 1 ? 'border-r border-black/20 dark:border-white/20 border-b sm:border-b-0' : ''
                  ]
                    .join(' ')
                    .trim()}
                >
                  <div className="font-mono text-[13px] font-medium">{card.value}</div>
                  <div className="text-[10px] tracking-wider uppercase opacity-55 mt-1.5">{card.title}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
