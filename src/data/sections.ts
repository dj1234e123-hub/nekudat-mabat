// עולמות התוכן של האתר — הקטגוריה הראשית של כל סיפור, אחת בדיוק לכל סיפור.
// החלוקה נגזרה מהתוכן עצמו (משדה המקור שבכרטיס הסיפור) ולא מתיאוריה:
// מי זה קרה לו? לאף אחד → משל · לדמות מוכרת → צדיקים · לי או למי שפגשתי → יומן.
//
// slug באנגלית לכתובות נקיות; התווית והשורה בעברית לתצוגה.
// accent — צבע מותג אחד לכל עולם, מופיע כקו דק בדלת ובתווית שבכרטיס.
// hidden — עולם ששמור לעתיד ואין בו עדיין תוכן: אינו מוצג כדלת בעמוד הסיפורים
// (דלת ריקה נראית כתקלה), אבל קיים בסכמה ונפתח מעצמו ברגע שיהיו בו סיפורים.
export interface Section {
  label: string;
  line: string;
  accent: string;
  hidden?: true;
}

export const SECTIONS_META = {
  meshalim: {
    label: 'משלים',
    line: 'סיפור שלא קרה — כדי שתראה בו את מה שכן',
    accent: 'var(--brick)',
  },
  tzadikim: {
    label: 'סיפורי צדיקים',
    line: 'רגעים קטנים מחייהם של אנשים גדולים',
    accent: 'var(--teal)',
  },
  yoman: {
    label: 'מהיומן שלי',
    line: 'מה שקרה לי, ומה שראיתי בדרך',
    accent: 'var(--blue)',
  },
} as const satisfies Record<string, Section>;

export type SectionSlug = keyof typeof SECTIONS_META;

export const SECTION_SLUGS = Object.keys(SECTIONS_META) as SectionSlug[];

/** התוויות בלבד — לשימושים שצריכים רק את השם (כרטיס, כותרת עמוד). */
export const SECTIONS = Object.fromEntries(
  SECTION_SLUGS.map((s) => [s, SECTIONS_META[s].label])
) as Record<SectionSlug, string>;
