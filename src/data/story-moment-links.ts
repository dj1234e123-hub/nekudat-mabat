// הגשר בין סיפור לרגע: תגית של סיפור → מצב בפינת הרגעים.
//
// הסיפורים נושאים תגיות (metadata בלבד, לא מוצג לקורא — החלטת 2026-08-23),
// והרגעים יושבים על מצבים. הטבלה הזו מחברת ביניהם, כדי שבסוף סיפור אפשר
// יהיה להציע "רגע של נקודת מבט על זה" — ולא רגע אקראי.
//
// לכל חיבור משקל: תגית ספציפית ("וידוי" → סוד) גוברת על תגית רחבה
// ("אמונה" מופיעה ב-10 מ-22 סיפורים, ולכן היא הרקע ולא הנושא). בסיפור
// שיש בו כמה תגיות ממופות נבחר המצב עם המשקל הגבוה ביותר, ובתיקו — הראשון
// בסדר התגיות של הסיפור (הכותב שם את העיקר ראשון).
//
// תגית שאינה כאן פשוט אינה מחברת. סיפור בלי אף תגית ממופה נופל לנושא
// (topic) שלו, ואם גם הוא חסר — אין הצעת רגע, ורק הסיפור הבא מוצג.
// הכלל הקיים באתר: מציגים רק מה שקיים באמת, ולא כופים חיבור.
import type { FeelingSlug } from './feelings';
import type { TopicSlug } from './topics';

export interface FeelingLink {
  feeling: FeelingSlug;
  weight: 1 | 2 | 3;
}

export const TAG_TO_FEELING: Record<string, FeelingLink> = {
  // כשקשה מול עצמך
  'וידוי': { feeling: 'secret', weight: 3 },
  'סוד': { feeling: 'secret', weight: 3 },
  'בושה': { feeling: 'shame', weight: 3 },
  'מה יגידו': { feeling: 'shame', weight: 3 },
  'תדמית': { feeling: 'shame', weight: 2 },
  'אשמה': { feeling: 'guilt', weight: 3 },
  'סליחה': { feeling: 'guilt', weight: 2 },
  'הורות': { feeling: 'guilt', weight: 2 },
  'אחריות': { feeling: 'guilt', weight: 1 },
  'קנאה': { feeling: 'envy', weight: 3 },
  'התמכרות': { feeling: 'losing-control', weight: 3 },

  // כשכואב
  'כעס': { feeling: 'anger', weight: 3 },
  'שליטה עצמית': { feeling: 'anger', weight: 2 },
  'תגובה': { feeling: 'anger', weight: 2 },
  'אובדן': { feeling: 'loss', weight: 3 },
  'שכול': { feeling: 'loss', weight: 3 },
  'בדידות': { feeling: 'loneliness', weight: 3 },
  'אלכוהוליזם': { feeling: 'loneliness', weight: 2 },
  'ילדות': { feeling: 'loneliness', weight: 1 },
  'משפחה': { feeling: 'loneliness', weight: 1 },
  'כאב': { feeling: 'pain', weight: 3 },
  'עצב': { feeling: 'sadness', weight: 3 },

  // כשקשה להתקדם
  'פחד': { feeling: 'fear', weight: 3 },
  'חרדה': { feeling: 'fear', weight: 3 },
  'התמודדות עם פחד': { feeling: 'fear', weight: 3 },
  'מחשבות על העתיד': { feeling: 'fear', weight: 2 },
  'אומץ': { feeling: 'fear', weight: 2 },
  'הצעד הבא': { feeling: 'standstill', weight: 2 },
  'התמדה': { feeling: 'standstill', weight: 2 },
  'תקיעות': { feeling: 'standstill', weight: 3 },
  'כישלון': { feeling: 'failure', weight: 3 },
  'המתנה': { feeling: 'waiting', weight: 3 },
  'פרנסה': { feeling: 'pressure', weight: 2 },
  'משבר כלכלי': { feeling: 'pressure', weight: 2 },
  'זמן': { feeling: 'pressure', weight: 1 },
  'בלבול': { feeling: 'confusion', weight: 3 },
  'בחירה': { feeling: 'confusion', weight: 1 },
  'עייפות': { feeling: 'exhaustion', weight: 3 },

  // כשמשהו נפתח
  'ביטחון עצמי': { feeling: 'confidence', weight: 3 },
  'זהות': { feeling: 'confidence', weight: 1 },
  'תקווה': { feeling: 'hope', weight: 2 },
  'התחלה חדשה': { feeling: 'new-beginning', weight: 3 },
  'תשובה': { feeling: 'new-beginning', weight: 2 },
  'הזדמנות שנייה': { feeling: 'new-beginning', weight: 2 },
  'שינוי': { feeling: 'new-beginning', weight: 1 },
  'תשומת לב': { feeling: 'good-moment', weight: 2 },

  // כשמרימים את המבט
  'תפילה': { feeling: 'prayer', weight: 3 },
  'השגחה פרטית': { feeling: 'providence', weight: 3 },
  'שליחות': { feeling: 'providence', weight: 2 },
  'אמונה': { feeling: 'faith', weight: 1 },
  'חסד': { feeling: 'gratitude', weight: 1 },
  'נתינה': { feeling: 'gratitude', weight: 1 },
  'מתנה': { feeling: 'gratitude', weight: 1 },
};

/** נפילה לאחור: נושא הסיפור (השדה הישן) → מצב. */
export const TOPIC_TO_FEELING: Record<TopicSlug, FeelingSlug> = {
  faith: 'faith',
  family: 'loneliness',
  journey: 'fear',
  loss: 'loss',
};
