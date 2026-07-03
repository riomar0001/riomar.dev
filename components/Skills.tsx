import SkillGroup from '@/components/ui/SkillGroup';
import ScrollReveal from '@/components/ui/ScrollReveal';

type SkillGroupT = { category: string; items: string[] };

export default function Skills({ skills }: { skills: SkillGroupT[] }) {
  return (
    <div id="skills" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <ScrollReveal>
          <div className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3">02 / Skills</div>
          <h2 className="text-[18px] sm:text-[26px] font-medium tracking-tight mb-7">Tools &amp; technologies</h2>
        </ScrollReveal>

        {skills.length === 0 ? (
          <ScrollReveal delay={120}>
            <div className="border border-black/20 dark:border-white/20 p-8 text-center font-mono text-xs opacity-50">
              No skills listed yet
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={120}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {skills.map((group) => (
                <SkillGroup key={group.category} {...group} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
