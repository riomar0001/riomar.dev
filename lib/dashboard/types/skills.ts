export type SkillItem = { id: string; name: string; order: number };

export type SkillGroup = { id: string; category: string; order: number; items: SkillItem[] };
