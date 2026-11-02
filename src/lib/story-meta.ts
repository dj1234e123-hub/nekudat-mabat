// עזרים לכרטיסי הסיפורים החדשים (שלב 3 בתוכנית הסיפורים, 2026-11-02): צפיות, "חדש", זמן קריאה,
// תאריך יחסי. כל המספרים נגזרים בזמן הבנייה; בנייה יומית שומרת אותם טריים.
import viewsData from '../data/views.json';
import { storyOpening } from './story-opening';

/** מספר הצפיות מוצג רק מכאן ומעלה. מספר נמוך מרחיק, לא מושך (החלטה 2026-11-02). */
export const VIEWS_MIN = 30;
/** סיפור שפורסם לפני פחות מכך נושא תגית "חדש". */
export const NEW_DAYS = 10;

type ViewsEntry = { he: number; es: number; total: number };

export function viewsOf(id: string): number {
  return (viewsData.views as Record<string, ViewsEntry>)[id]?.total ?? 0;
}

export const showViews = (n: number) => n >= VIEWS_MIN;
export const formatViews = (n: number) => n.toLocaleString('en-US');

const DAY = 864e5;
export const daysSince = (date: Date, now = Date.now()) => Math.floor((now - date.getTime()) / DAY);
export const isNew = (date: Date) => daysSince(date) <= NEW_DAYS;

/** דקות קריאה: משדה readingTime ("כ־2 דקות") אם יש, אחרת לפי ספירת מילים. */
export function minutesOf(story: { body?: string; data: { readingTime?: string } }): number {
  const t = story.data.readingTime;
  if (t) {
    const m = t.match(/\d+/);
    if (m) return Number(m[0]);
    if (/דקה|minuto/.test(t)) return 1;
  }
  return Math.max(1, Math.round((story.body ?? '').trim().split(/\s+/).length / 180));
}

/** שאלת ה-hook של הסיפור; בלי hook – שתי שורות הפתיחה. */
export function hookOf(story: { body?: string; data: { hook?: string } }): { text: string; isHook: boolean } {
  return story.data.hook
    ? { text: story.data.hook, isHook: true }
    : { text: storyOpening(story.body), isHook: false };
}

export function relativeDate(date: Date, lang: 'he' | 'es' = 'he'): string {
  const n = daysSince(date);
  if (lang === 'es') {
    if (n <= 0) return 'hoy';
    if (n === 1) return 'ayer';
    if (n <= 14) return `hace ${n} días`;
    if (n <= 60) return `hace ${Math.round(n / 7)} semanas`;
    return `hace ${Math.round(n / 30)} meses`;
  }
  if (n <= 0) return 'היום';
  if (n === 1) return 'אתמול';
  if (n <= 14) return `לפני ${n} ימים`;
  if (n <= 60) return `לפני ${Math.round(n / 7)} שבועות`;
  return `לפני ${Math.round(n / 30)} חודשים`;
}
