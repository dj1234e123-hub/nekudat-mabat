// שורות הפתיחה של סיפור — לכרטיס "הסיפור הבא" (NextUp).
//
// המדידה (30 יום עד 2026-09-08): 18% ממי שנחת על סיפור המשיך לעמוד נוסף,
// מול יעד 20–25%. הכרטיס הציג שם בלבד; שם הוא הבטחה, ופתיחה היא טעימה.
// הסיפורים נפתחים במתח בכוונה (החלטת "פתיחת סיפורים"), ולכן הפתיחה עצמה
// היא הפיתוי הטוב ביותר — לא תקציר שמסביר.
//
// הסיפורים כתובים שורה-לפסקה. לוקחים את השורות הראשונות עד תקרת מילים,
// מסירים סימוני Markdown, והעמוד קוטם לשתי שורות ב-CSS.

const MAX_WORDS = 28;

export function storyOpening(body: string | undefined): string {
  if (!body) return '';
  const words: string[] = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) {
      if (words.length > 0) break; // סוף הפסקה הראשונה
      continue;
    }
    // כותרת, תמונה, HTML, מפריד — לא פתיחה
    if (/^(#|!\[|<|---|\*\*\*)/.test(line)) continue;
    const clean = line
      .replace(/^>\s?/, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1');
    words.push(...clean.split(/\s+/));
    if (words.length >= MAX_WORDS) break;
  }
  if (words.length === 0) return '';
  const cut = words.length > MAX_WORDS;
  return words.slice(0, MAX_WORDS).join(' ') + (cut ? '…' : '');
}
