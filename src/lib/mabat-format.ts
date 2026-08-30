// פענוח גוף "מבט לשבת" — אותה שיטת שבירה כמו ברגעים (docs/MOMENT-FORMAT.md):
// שורה ריקה מפרידה בין מהלכים, ושבירת השורה בתוך מהלך היא תוכן ולא עיצוב.
//
// בנוסף: שורה שמכילה רק כוכביות (***) היא סימן הפרדה שקט בין חלקי המאמר —
// הרעיון וההגייה שלו נשארים כלליים בכוונה, כי מבנה המאמר (סיפור/פרשה/מבט,
// או כל חלוקה אחרת) משתנה משבוע לשבוע ואין לו מספר קבוע של חלקים.
import { lineHtml, plain } from './moment-format';

export type Block = { type: 'stanza'; lines: string[] } | { type: 'divider' };

const DIVIDER = /^\*{3,}$/;

export function parseBody(body: string): Block[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length) {
      blocks.push({ type: 'stanza', lines: current });
      current = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (DIVIDER.test(line)) {
      flush();
      blocks.push({ type: 'divider' });
    } else if (line) {
      current.push(line);
    } else {
      flush();
    }
  }
  flush();

  return blocks;
}

/** הטקסט כמלל נקי — לתיאור העמוד ולשיתוף בוואטסאפ. */
export function plainText(blocks: Block[]): string {
  return blocks
    .filter((b): b is { type: 'stanza'; lines: string[] } => b.type === 'stanza')
    .map((b) => b.lines.map(plain).join('\n'))
    .join('\n\n');
}

export { lineHtml };
