// עזרים משותפים לשתי הפינות השבועיות ("מבט לשבת" ו"מעשה שהיה"), בשתי השפות.
// הכל נגזר מהתוכן – אין כאן שום דבר שצריך לעדכן ידנית כל שבוע.
import { plain } from './moment-format';

const DAY = 24 * 60 * 60 * 1000;

interface Dated {
  id: string;
  data: { date: Date };
}

/**
 * הזוג מאותה שבת: גיליון "מבט לשבת" עולה ביום חמישי/שישי (או בערב חג),
 * והסיפור של "מעשה שהיה" במוצאי אותה שבת. הזיווג לפי תאריך ולא לפי שם
 * הפרשה – כך הוא עובד גם במועדים ("חג הסוכות" מול "מוצאי שבת סוכות") ובשתי
 * השפות בלי מילון. הפרש של 0–3 ימים בין הגיליון לסיפור.
 */
export function storyAfter<T extends Dated>(issue: Dated, stories: T[]): T | undefined {
  const t = issue.data.date.getTime();
  return stories.find((s) => {
    const d = s.data.date.getTime() - t;
    return d >= 0 && d <= 3 * DAY;
  });
}

export function issueBefore<T extends Dated>(story: Dated, issues: T[]): T | undefined {
  const t = story.data.date.getTime();
  return issues.find((i) => {
    const d = t - i.data.date.getTime();
    return d >= 0 && d <= 3 * DAY;
  });
}

/** האם הפריט הוא האחרון בפינה ופורסם בשבוע האחרון – ל"של השבוע". */
export function isThisWeek(item: Dated, newestFirstList: Dated[]): boolean {
  return newestFirstList[0]?.id === item.id && Date.now() - item.data.date.getTime() < 8 * DAY;
}

/** החודש העברי (עם השנה) מתוך hebrewDate – לקיבוץ השער. */
export function monthLabel(hebrewDate: string, lang: 'he' | 'es'): string {
  if (lang === 'es') {
    const m = hebrewDate.match(/de\s+(.+)$/);
    return m ? m[1].trim() : hebrewDate;
  }
  // "כ' בחשוון תשפ"ז" → "חשוון תשפ"ז"
  const m = hebrewDate.match(/\sב(\S+(?:\s+\S+)?)$/);
  return m ? m[1].trim() : hebrewDate;
}

/** טקסט נקי להשוואה: בלי הדגשות, פיסוק סופי ורווחים כפולים. */
export function normalize(s: string): string {
  return plain(s).replace(/\s+/g, ' ').trim().toLocaleLowerCase();
}
