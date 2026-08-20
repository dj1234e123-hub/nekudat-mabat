import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
        section: z.enum(['empowerment', 'shabbat', 'baal-shem-tov']),
        topic: z.enum(['family', 'journey', 'faith', 'loss']).optional(),
        archiveId: z.string().min(1).optional(),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
        date: z.coerce.date(),
        excerpt: z.string().min(1),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'סיפור עם תמונת שער חייב גם טקסט חלופי (coverAlt)',
      }),
});

export const collections = { stories };
