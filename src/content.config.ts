import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FEELING_SLUGS, type FeelingSlug } from './data/feelings';
import { SECTION_SLUGS, type SectionSlug } from './data/sections';

// אוסף הסיפורים: כל קובץ Markdown בתיקייה src/content/stories הוא סיפור.
// section (עולם תוכן) – חובה. topic – תגית משנה אופציונלית.
// archiveId – מספר הארכיון המקורי מהדרייב של בעל הפרויקט, נשמר כפי שהוא.
// cover – אופציונלי זמנית: סיפור בלי תמונה מקבל שער זמני לפי הקטגוריה,
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
        /**
         * שאלה שהסיפור עונה עליה, בגוף "אנחנו" (2026-09-16) – הפיתוי בכרטיס
         * העולם בעמוד הסיפורים. אותו נוסח שכבר עובד בהודעה לקבוצה: שאלה
         * שהקורא עונה עליה בראש לפני שלחץ, בלי לחשוף את המסקנה. אופציונלי:
         * סיפור בלי hook נופל לשתי שורות הפתיחה שלו (story-opening.ts).
         */
        hook: z.string().min(1).optional(),
        /** מחליף את חישוב זמן הקריאה האוטומטי, למשל "כ־90 שניות" (מתוך כרטיס הסיפור) */
        readingTime: z.string().optional(),
        /**
         * סדר ההופעה בדף הבית. מספר = הסיפור מוצג שם, והמספר קובע את המיקום.
         * דף הבית הוא הרושם הראשון, ולכן הוא בחירה ולא תוצאה של סדר פרסום.
         * בלי אף סיפור מסומן – דף הבית נופל אחורה לשלושה האחרונים.
         */
        featured: z.number().int().positive().optional(),
        /** תגיות מכרטיס הסיפור – מטא-דאטה בלבד, לא מוצג לקורא בשלב זה */
        tags: z.array(z.string()).optional(),
        /** שורת המקור מכרטיס הסיפור – מטא-דאטה בלבד, לא מוצג לקורא בשלב זה */
        source: z.string().optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'סיפור עם תמונת שער חייב גם טקסט חלופי (coverAlt)',
      }),
});

// "רגע של נקודת מבט" – תכנים קצרים לפי מצב או רגש.
// אוסף נפרד לגמרי מהסיפורים: לכל סוג תוכן הכללים שלו, כדי שהוולידציה תישאר קשיחה.
// המבנה מכוון לפשטות מרבית בקליטת תוכן – רק המצב והתאריך, והטקסט עצמו בגוף הקובץ.
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
     * הפורמט החדש בקובץ מסוים – כך ההגירה התקדמה קובץ-קובץ בלי שהאתר יישבר.
     * כל 66 הוגרו, ולכן השדה נעשה חובה: מעכשיו רגע בלי כותרת מכשיל את
     * הבנייה, וזה מה שמונע חזרה לאחור בשקט.
     */
    title: z.string().min(1),
    /**
     * "נקודה לדרך" – שורה אחת שהקורא לוקח איתו ליום (docs/MOMENT-FORMAT.md).
     * נגזרת מהסיבוב, באותה מילה, ואינה עצה חדשה. עד שתי שורות; שבירת שורה
     * (\n) נשמרת בכרטיס. אופציונלי: רגע בלי השדה מוצג כמו קודם, וכך ההוספה
     * מתקדמת רגע-רגע בלי שהאתר יישבר – אותו דפוס שהכניס את title.
     */
    handle: z.string().min(1).optional(),
  }),
});

// הרגעים בספרדית. אוסף נפרד עם אותם מזהי קבצים כמו העברי, כדי שהזיווג בין
// המקור לתרגום יהיה אוטומטי. **מבחר ולא מראה:** רגע בלי תרגום פשוט אינו
// קיים כאן, ואינו מייצר עמוד – כך האזור הספרדי לעולם אינו חוב שרודף כל תוכן חדש.
const momentsEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/moments-es' }),
  schema: z.object({
    feeling: z.enum(FEELING_SLUGS as [FeelingSlug, ...FeelingSlug[]]),
    date: z.coerce.date(),
    // כותרת-הוו בספרדית – אותו תפקיד ואותה חובה כמו באוסף העברי:
    // כל 75 הרגעים תורגמו בפורמט החדש, ורגע בלי כותרת מכשיל את הבנייה.
    title: z.string().min(1),
    // "נקודה לדרך" בספרדית – תרגום של השדה העברי, אותם כללים (עד שתי שורות).
    handle: z.string().min(1).optional(),
  }),
});

// הסיפורים בספרדית. אותו עיקרון כמו momentsEs: אוסף נפרד עם אותם מזהי
// קבצים כמו העברי – הזיווג בין מקור לתרגום אוטומטי, וסיפור בלי תרגום
// פשוט אינו קיים באזור הספרדי ("מבחר ולא מראה").
// cover אופציונלי: רוב הסיפורים מפנים לאותה תמונת שער כמו העברית; סיפור
// שהתמונה שלו נושאת כיתוב עברי (#009, #013, #017, #038) נשאר בלי cover
// ומקבל את שער הקטגוריה הזמני – עד שבעל הפרויקט יכין גרסה בלי כיתוב.
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
        /**
         * שאלה שהסיפור עונה עליה, בגוף "אנחנו" (2026-09-16) – הפיתוי בכרטיס
         * העולם בעמוד הסיפורים. אותו נוסח שכבר עובד בהודעה לקבוצה: שאלה
         * שהקורא עונה עליה בראש לפני שלחץ, בלי לחשוף את המסקנה. אופציונלי:
         * סיפור בלי hook נופל לשתי שורות הפתיחה שלו (story-opening.ts).
         */
        hook: z.string().min(1).optional(),
        readingTime: z.string().optional(),
        featured: z.number().int().positive().optional(),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'סיפור עם תמונת שער חייב גם טקסט חלופי (coverAlt)',
      }),
});

// "מעשה שהיה" – סיפור בעל שם טוב לכל מוצאי שבת (פינה קבועה, נפרדת מארכיון
// הסיפורים הראשי ומהמספור שלו). מבוסס על המנהג לספר סיפורי בעש"ט במוצאי
// שבת (שיורי המנחה, "בארות המים", הריי"צ מליובאוויטש).
//
// למה אוסף נפרד ולא עוד עולם בתוך stories: המועד הוא חלק מהזהות (מוצאי
// שבת מסוים, ולא תאריך פרסום שרירותי), התמונה משותפת לכל הפינה במקום
// שער לכל סיפור, ויש "מחשבה" חותמת אחת – שלושה דברים שאין לסיפור רגיל.
//
// הגוף הוא פרוזה רגילה (Markdown), לא פורמט השורות של הרגעים: זה סיפור
// שמספר מה קרה למישהו אחר, לפי כלל שבירת השורות הקיים באתר.
//
// thought – שורת ה"מחשבה" שחותמת את הסיפור. בפרונטמאטר ולא בגוף, כי היא
// אובייקט אחר: הסיפור נעצר על דברי הבעל שם טוב, והמחשבה מגיעה אחריו
// כהד – בדיוק כמו חתימת השבת ב"מבט לשבת". שורה אחת, לא פסקה.
const besht = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/besht' }),
  schema: z.object({
    title: z.string().min(1),
    /** המועד שהסיפור נכתב אליו, כפי שהוא מוצג: "מוצאי שבת שובה" */
    occasion: z.string().min(1),
    hebrewDate: z.string().min(1),
    date: z.coerce.date(),
    /** שורת התצוגה המקדימה (וואטסאפ, גוגל) – מסקרנת, בלי לחשוף את הסוף */
    excerpt: z.string().min(1),
    /** המחשבה החותמת – שורה אחת שמוסיפה ולא חוזרת על הסיפור */
    thought: z.string().min(1),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
  }),
});

// "מעשה שהיה" בספרדית ("Así sucedió") – אותו זיווג לפי שם קובץ כמו שאר
// האוספים הספרדיים, ואותה סכמה כמו העברי. "מבחר ולא מראה": סיפור בלי
// תרגום פשוט אינו קיים בספרדית. הכתובת הציבורית נגזרת ממפת ES_BESHT_SLUGS.
const beshtEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/besht-es' }),
  schema: z.object({
    title: z.string().min(1),
    occasion: z.string().min(1),
    hebrewDate: z.string().min(1),
    date: z.coerce.date(),
    excerpt: z.string().min(1),
    thought: z.string().min(1),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
  }),
});

// "מבט לשבת" בספרדית – אותו זיווג לפי שם קובץ.
// quoteImage – אותו כלל כמו בעברית: תמונת ציטוט אופציונלית (בספרדית, LTR),
// מוצגת בסוף המאמר. "הספרדית משקפת את העברית העדכנית" – אותו מבנה ואותה היררכיה.
const mabatEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mabat-es' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        // שורת התצוגה המקדימה (וואטסאפ, גוגל). בלעדיה היא נגזרת מפתיחת
        // הטור – וזו חזרה על מה שהקורא כבר עומד לקרוא. כאן אפשר לכתוב
        // שורה מסקרנת מתוך הסיפור, בלי לחשוף את סופו.
        description: z.string().min(1).optional(),
        signoff: z.string().min(1),
        signedBy: z.string().min(1),
        quoteImage: image().optional(),
        quoteImageAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.quoteImage || !!data.quoteImageAlt, {
        message: 'תמונת ציטוט חייבת גם טקסט חלופי (quoteImageAlt)',
      }),
});

// "מבט לשבת" – טור שבועי: סיפור אמיתי, חיבור לפרשת השבוע, ומבט על האדם.
// בשונה מסיפורים ומרגעים, כאן מותר (ואפילו נדרש) להסביר ולעצור על הרעיון –
// זו בדיוק הסיבה שזה אוסף נפרד ולא עוד עולם בתוך הסיפורים.
// חתימת השבת (signoff) נשמרת בפרונטמאטר ולא בגוף, כי היא לא חלק מהמאמר
// עצמו אלא תוספת אישית של אפרים – יכולה להשתנות מבנה משבוע לשבוע.
// quoteImage – אופציונלי, לפי סקיל mabat-quote-image (.claude/skills/mabat-quote-image):
// תמונת ציטוט 1080×1350 בשפת המותג, מוצגת בסוף המאמר ולא בתחילתו (כדי
// שלא תספיילר את המסקנה שהטור בנוי כדי להחזיק עד הסוף). אותו כלל
// cover/coverAlt כמו בסיפורים – תמונה חייבת טקסט חלופי.
const mabatLeshabbat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mabat-leshabbat' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        parasha: z.string().min(1),
        hebrewDate: z.string().min(1),
        date: z.coerce.date(),
        // שורת התצוגה המקדימה (וואטסאפ, גוגל). בלעדיה היא נגזרת מפתיחת
        // הטור – וזו חזרה על מה שהקורא כבר עומד לקרוא. כאן אפשר לכתוב
        // שורה מסקרנת מתוך הסיפור, בלי לחשוף את סופו.
        description: z.string().min(1).optional(),
        signoff: z.string().min(1),
        signedBy: z.string().min(1),
        quoteImage: image().optional(),
        quoteImageAlt: z.string().min(1).optional(),
      })
      .refine((data) => !data.quoteImage || !!data.quoteImageAlt, {
        message: 'תמונת ציטוט חייבת גם טקסט חלופי (quoteImageAlt)',
      }),
});

export const collections = { stories, moments, momentsEs, mabatLeshabbat, storiesEs, mabatEs, besht, beshtEs };
