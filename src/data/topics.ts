// רשימת הנושאים של האתר. slug באנגלית לכתובות URL נקיות (נוח לשיתוף בוואטסאפ),
// והתווית בעברית לתצוגה. הוספת נושא = שורה חדשה כאן + עדכון ה-enum ב-content.config.ts.
export const TOPICS = {
  family: 'משפחה',
  journey: 'מסע',
  faith: 'אמונה',
  loss: 'אובדן',
} as const;

export type TopicSlug = keyof typeof TOPICS;

export const TOPIC_SLUGS = Object.keys(TOPICS) as TopicSlug[];
