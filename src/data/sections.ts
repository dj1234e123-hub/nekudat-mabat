// שלושת עולמות התוכן של האתר — הקטגוריה הראשית של כל סיפור.
// slug באנגלית לכתובות נקיות; התווית בעברית לתצוגה.
export const SECTIONS = {
  empowerment: 'סיפורי העצמה',
  shabbat: 'מבט לשבת',
  'baal-shem-tov': 'סיפורי הבעל שם טוב',
} as const;

export type SectionSlug = keyof typeof SECTIONS;

export const SECTION_SLUGS = Object.keys(SECTIONS) as SectionSlug[];
