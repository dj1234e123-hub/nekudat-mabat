import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// אוסף הסיפורים: כל קובץ Markdown בתיקייה src/content/stories הוא סיפור.
// כל השדות חובה — סיפור עם שדה חסר ייכשל ב-build ולא יתפרסם בטעות.
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      topic: z.enum(['family', 'journey', 'faith', 'loss']),
      cover: image(),
      coverAlt: z.string().min(1),
      date: z.coerce.date(),
      excerpt: z.string().min(1),
    }),
});

export const collections = { stories };
