// עזרים לכרטיסי הסיפורים החדשים (שלב 3 בתוכנית הסיפורים, 2026-11-02): צפיות, "חדש", זמן קריאה,
// תאריך יחסי. כל המספרים נגזרים בזמן הבנייה; בנייה יומית שומרת אותם טריים.
import viewsData from '../data/views.json';
import { storyOpening } from './story-opening';

/** מספר הצפיות מוצג רק מכאן ומעלה. מספר נמוך מרחיק, לא מושך (החלטה 2026-11-02). */
export const VIEWS_MIN = 30;
/** סיפור שפורסם לפני פחות מכך נושא תגית "חדש". */
export const NEW_DAYS = 10;

type ViewsEntry = { he: number; es: number; total: number };
type CornerViews = Record<'mabat' | 'besht', Record<string, ViewsEntry>>;

/** בסיס קבוע שנוסף לכל סיפור: הוסר ב-2026-11-03 לבקשת בעל הפרויקט (היה 100). המוצג = הספירה האמיתית. */
export const VIEWS_BASE = 0;

export function viewsOf(id: string): number {
  return ((viewsData.views as Record<string, ViewsEntry>)[id]?.total ?? 0) + VIEWS_BASE;
}

/** צפיות בגיליון של מבט לשבת או בסיפור של מעשה שהיה (עברית + ספרדית). 0 = עוד לא נספר, ואז לא מוצג. */
export function cornerViewsOf(kind: 'mabat' | 'besht', id: string): number {
  return ((viewsData as { corners?: CornerViews }).corners?.[kind]?.[id]?.total ?? 0);
}

/**
 * מאגר הסיפור המרכזי המתחלף: חמשת הנצפים ביותר, בלי הסיפור החדש ביותר (stories[0], מהחדש לישן)
 * שיש לו שורת "חדש" קבועה. הראשון במאגר הוא ברירת המחדל בלי JavaScript.
 */
export function heroPool<T extends { id: string; data: { date: Date } }>(stories: T[], size = 5): T[] {
  return stories
    .slice(1)
    .sort((a, b) => viewsOf(b.id) - viewsOf(a.id) || b.data.date.getTime() - a.data.date.getTime())
    .slice(0, size);
}

/**
 * רצועת "הכי נקראים" בלי הסיפור שכבר מוצג כסיפור המרכזי באותו עמוד (2026-11-10): נבנה כרטיס אחד עודף,
 * והכרטיס של הסיפור המרכזי (או האחרון, אם המרכזי אינו ברשימה) מוסתר. הדירוג נספר על הגלויים בלבד.
 * כשהסיפור המרכזי מוגרל בדפדפן, RotatingHero מעביר את ההסתרה לכרטיס הנכון וממספר מחדש.
 */
export function topShelf<T extends { id: string; data: { date: Date } }>(stories: T[], size: number, heroId?: string) {
  const all = [...stories]
    .sort((a, b) => viewsOf(b.id) - viewsOf(a.id) || b.data.date.getTime() - a.data.date.getTime())
    .slice(0, size + 1);
  if (all.length <= size) return all.filter((s) => s.id !== heroId).map((story, i) => ({ story, rank: i + 1, hidden: false }));
  const dup = all.findIndex((s) => s.id === heroId);
  const hide = dup >= 0 ? dup : all.length - 1;
  return all.map((story, i) => ({ story, rank: i + 1 - (i > hide ? 1 : 0), hidden: i === hide }));
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
