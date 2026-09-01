// "הסיפור הבא" — המאגר שממנו מוגרל הסיפור שמוצג בסוף כל עמוד סיפור.
//
// **הכלל: תמיד מעולם אחר.** מי שקרא סיפור אישי מקבל משל; מי שקרא משל מקבל
// סיפור צדיקים. הקורא שהגיע משיתוף בוואטסאפ ראה עמוד אחד בלבד ואינו יודע
// שיש כאן יותר מסוג אחד — כרטיס מעולם אחר מלמד את זה בלי שאיש מסביר לו.
//
// **מוגרל בכל טעינה** (החלטת בעל הפרויקט, 2026-09-01) — כמו הרגע בדף הבית:
// כל המאגר נבנה כ-<template> מוסתרים, וסקריפט קצר בוחר אחד. בלי JavaScript
// (ולמנועי חיפוש) מוצג הראשון ברשימה, ולכן הסדר כאן קובע את ברירת המחדל:
// הסיפור הנבחר (featured) של עולם אחר, ואחריו לפי החדש-לישן.
//
// אם אין סיפור מעולם אחר (עולם יחיד) — נופלים לשאר הסיפורים מאותו עולם,
// כדי שהכרטיס לעולם לא ייעלם בשקט.
import { newestFirst } from './sort';

interface StoryLike {
  id: string;
  data: { date: Date; section: string; featured?: number };
}

export function nextStoryPool<T extends StoryLike>(all: T[], current: T): T[] {
  const others = all.filter((s) => s.id !== current.id);
  const otherWorlds = others.filter((s) => s.data.section !== current.data.section);
  const pool = otherWorlds.length > 0 ? otherWorlds : others;
  return pool.sort(
    (a, b) =>
      (a.data.featured ?? Number.POSITIVE_INFINITY) - (b.data.featured ?? Number.POSITIVE_INFINITY) ||
      newestFirst(a, b)
  );
}
