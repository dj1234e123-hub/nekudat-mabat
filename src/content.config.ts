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
    // כותרת-הוו בספרדית — אותו תפקיד ואותה חובה כמו באוסף העברי:
    // כל 75 הרגעים תורגמו בפורמט החדש, ורגע בלי כותרת מכשיל את הבנייה.
    title: z.string().min(1),
  }),
});

// הסיפורים בספרדית. אותו עיקרון כמו momentsEs: אוסף נפרד עם אותם מזהי
// קבצים כמו העברי — הזיווג בין מקור לתרגום אוטומטי, וסיפור בלי תרגום
// פשוט אינו קיים באזור הספרדי ("מבחר ולא מראה").
// cover אופציונלי: רוב הסיפורים מפנים לאותה תמונת שער כמו העברית; סיפור
// שהתמונה שלו נושאת כיתוב עברי (#009, #013, #017, #038) נשאר בלי cover
// ומקבל את שער הקטגוריה הזמני — עד שבעל הפרויקט יכין גרסה בלי כיתוב.
const storiesEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories-es' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        section: z.enum(SECTION_SLUGS as [SectionSlug, ...SectionSlug[]]),
        archiveId: z.string().min(1).optional(),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
        date: z.coerce.date(),
        excerpt: z.string().min(1),
        readingTime: z.string().optional(),
        featured: z.number().int().positive().optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'סיפור עם תמונת שער חייב גם טקסט חלופי (coverAlt)',
      }),
});

// "מבט לשבת" בספרדית — אותו זיווג לפי שם קובץ.
// quoteImage — אותו כלל כמו בעברית: תמונת ציטוט אופציונלית (בספרדית, LTR),
// מוצגת בסוף המאמר. "הספרדית משקפת את העברית העדכנית" — אותו מבנה ואותה היררכיה.
const mabatEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mabat-es' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        signoff: z.string().min(1),
        signedBy: z.string().min(1),
        quoteImage: image().optional(),
        quoteImageAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.quoteImage || !!data.quoteImageAlt, {
        message: 'תמונת ציטוט חייבת גם טקסט חלופי (quoteImageAlt)',
      }),
});

// "מעשה שהיה" — פינת סיפורי הבעל שם טוב, קבועה למוצאי שבת.
// אוסף שטוח כמו mabatLeshabbat: כל קובץ הוא סיפור אחד, גוף הקובץ הוא
// הסיפור עצמו בפסקאות (Markdown רגיל — לא פורמט השורות של הרגעים, כי סיפור
// שמספר מה קרה למישהו אחר לאורך זמן כתוב בפסקאות, לפי הכלל הקיים באתר).
// date הוא רגע היציאה לאוויר (מוצאי שבת עצמו) — אותו שדה ואותה רשת ביטחון
// (isPublished) כמו בכל אוסף מתוזמן אחר: תוכן עתידי אינו נבנה כלל.
// parasha/hebrewDate — כמו ב-mabatLeshabbat, אבל לא תמיד פרשת שבוע פשוטה:
// חלק מארבעת מוצאי השבתות שהמנוע נבנה סביבם הם חגים (סוכות, שמיני עצרת)
// ולא שבת של פרשה רגילה. לכן השדה נושא את התווית המלאה והנכונה כפי
// שצריך להופיע (למשל "פרשת האזינו · שבת שובה" או "חג הסוכות"), ולא
// מוצג עם קידומת "פרשת" קבועה בתבנית — זו אחריות התוכן, לא התצוגה.
// thought — "המחשבה לשבוע" שאחרי הסיפור: לא מוסר השכל, נקודת מבט קצרה
// שנולדת מהסיפור. שדה נפרד מהגוף, מוצג בעיצוב נבדל (הצבע הייחודי לפינה).
// source — שורת מקור/רמת אמינות, כמו שכבר נהוג בכרטיסי המחקר לפני כתיבה.
// cover אופציונלי: בלי תמונה אמיתית עדיין, הפינה מציגה איור-דמדומים משותף
// (BeshtArt.astro) — אותו דפוס בדיוק כמו שערי הרגעים לפני שהגיעו הצילומים.
const besht = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/besht' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        excerpt: z.string().min(1),
        thought: z.string().min(1),
        source: z.string().min(1),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'תמונה חייבת גם טקסט חלופי (coverAlt)',
      }),
});

// "מעשה שהיה" בספרדית — "Así sucedió". אותו סכמה בדיוק, אותם שמות קבצים
// (זיווג אוטומטי). "מבחר ולא מראה": סיפור עברי בלי תרגום פשוט לא מייצר
// עמוד ספרדי.
const beshtEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/besht-es' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        excerpt: z.string().min(1),
        thought: z.string().min(1),
        source: z.string().min(1),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'תמונה חייבת גם טקסט חלופי (coverAlt)',
      }),
});

// "מבט לשבת" — טור שבועי: סיפור אמיתי, חיבור לפרשת השבוע, ומבט על האדם.
// בשונה מסיפורים ומרגעים, כאן מותר (ואפילו נדרש) להסביר ולעצור על הרעיון —
// זו בדיוק הסיבה שזה אוסף נפרד ולא עוד עולם בתוך הסיפורים.
// חתימת השבת (signoff) נשמרת בפרונטמאטר ולא בגוף, כי היא לא חלק מהמאמר
// עצמו אלא תוספת אישית של אפרים — יכולה להשתנות מבנה משבוע לשבוע.
// quoteImage — אופציונלי, לפי סקיל mabat-quote-image (.claude/skills/mabat-quote-image):
// תמונת ציטוט 1080×1350 בשפת המותג, מוצגת בסוף המאמר ולא בתחילתו (כדי
// שלא תספיילר את המסקנה שהטור בנוי כדי להחזיק עד הסוף). אותו כלל
// cover/coverAlt כמו בסיפורים — תמונה חייבת טקסט חלופי.
const mabatLeshabbat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mabat-leshabbat' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        signoff: z.string().min(1),
        signedBy: z.string().min(1),
        quoteImage: image().optional(),
        quoteImageAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.quoteImage || !!data.quoteImageAlt, {
        message: 'תמונת ציטוט חייבת גם טקסט חלופי (quoteImageAlt)',
      }),
});

export const collections = {
  stories,
  moments,
  momentsEs,
  mabatLeshabbat,
  storiesEs,
  mabatEs,
  besht,
  beshtEs,
};
