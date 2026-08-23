import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FEELING_SLUGS, type FeelingSlug } from './data/feelings';
import { SECTION_SLUGS, type SectionSlug } from './data/sections';

// אוסף הסיפורים: כל קובץ Markdown בתיקייה src/content/stories הוא סיפור.
// section (עולם תוכן) — חובה. topic — תגית משנה אופציונלית.
// archiveId — מספר הארכיון המקורי מהדרייב של בעל הפרויקט, נשמר כפי שהוא.
// cover — אופציונלי זמנית: סיפור בלי תמונה מקבל שער זמני לפי הקטגוריה,
// והחוסר נרשם ברשימת החוסרים (docs/CONTENT.md).
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        section: z.enum(SECTION_SLUGS as [SectionSlug, ...SectionSlug[]]),
        topic: z.enum(['family', 'journey', 'faith', 'loss']).optional(),
        archiveId: z.string().min(1).optional(),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
        date: z.coerce.date(),
        excerpt: z.string().min(1),
        /** מחליף את חישוב זמן הקריאה האוטומטי, למשל "כ־90 שניות" (מתוך כרטיס הסיפור) */
        readingTime: z.string().optional(),
        /**
         * סדר ההופעה בדף הבית. מספר = הסיפור מוצג שם, והמספר קובע את המיקום.
         * דף הבית הוא הרושם הראשון, ולכן הוא בחירה ולא תוצאה של סדר פרסום.
         * בלי אף סיפור מסומן — דף הבית נופל אחורה לשלושה האחרונים.
         */
        featured: z.number().int().positive().optional(),
        /** תגיות מכרטיס הסיפור — מטא-דאטה בלבד, לא מוצג לקורא בשלב זה */
        tags: z.array(z.string()).optional(),
        /** שורת המקור מכרטיס הסיפור — מטא-דאטה בלבד, לא מוצג לקורא בשלב זה */
        source: z.string().optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'סיפור עם תמונת שער חייב גם טקסט חלופי (coverAlt)',
      }),
});

// "רגע של נקודת מבט" — תכנים קצרים לפי מצב או רגש.
// אוסף נפרד לגמרי מהסיפורים: לכל סוג תוכן הכללים שלו, כדי שהוולידציה תישאר קשיחה.
// המבנה מכוון לפשטות מרבית בקליטת תוכן — רק המצב והתאריך, והטקסט עצמו בגוף הקובץ.
// רשימת המצבים המותרים נגזרת אוטומטית מ-src/data/feelings.ts: מצב חדש שם = תקף כאן מיד.
const moments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/moments' }),
  schema: z.object({
    feeling: z.enum(FEELING_SLUGS as [FeelingSlug, ...FeelingSlug[]]),
    date: z.coerce.date(),
    /**
     * כותרת-הוו של הרגע (docs/MOMENT-FORMAT.md). 2-4 מילים, שאלה או הצהרה.
     * היא והסיום נכתבים כזוג: הכותרת פותחת מסגרת והסיום נועל אותה.
     *
     * **חובה.** בזמן ההגירה השדה היה אופציונלי, וקיומו היה המתג שהפעיל את
     * הפורמט החדש בקובץ מסוים — כך ההגירה התקדמה קובץ-קובץ בלי שהאתר יישבר.
     * כל 66 הוגרו, ולכן השדה נעשה חובה: מעכשיו רגע בלי כותרת מכשיל את
     * הבנייה, וזה מה שמונע חזרה לאחור בשקט.
     */
    title: z.string().min(1),
  }),
});

// הרגעים בספרדית. אוסף נפרד עם אותם מזהי קבצים כמו העברי, כדי שהזיווג בין
// המקור לתרגום יהיה אוטומטי. **מבחר ולא מראה:** רגע בלי תרגום פשוט אינו
// קיים כאן, ואינו מייצר עמוד — כך האזור הספרדי לעולם אינו חוב שרודף כל תוכן חדש.
const momentsEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/moments-es' }),
  schema: z.object({
    feeling: z.enum(FEELING_SLUGS as [FeelingSlug, ...FeelingSlug[]]),
    date: z.coerce.date(),
  }),
});

export const collections = { stories, moments, momentsEs };
