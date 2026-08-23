// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // הדומיין הקבוע של האתר (חובר 2026-08-21).
  // משמש לקישורים מוחלטים: שיתוף, תגיות תצוגה מקדימה (Open Graph), כתובות קנוניות.
  site: 'https://nekudatmabat.blog',
  integrations: [
    // מפת האתר — הרשימה שמוגשת לגוגל ב-Search Console.
    // בלעדיה גוגל צריך למצוא כ-100 עמודים אחד-אחד דרך קישורים.
    sitemap({
      // מה שמסומן noindex לא נכנס למפה: להגיש לגוגל כתובת ולבקש ממנו
      // להתעלם ממנה באותה נשימה זה סימן מבלבל.
      // האזור הספרדי סגור עד שדובר ספרדית יעבור עליו (החלטה 2026-08-23).
      filter: (page) => !page.includes('/es/'),
    }),
  ],
});
