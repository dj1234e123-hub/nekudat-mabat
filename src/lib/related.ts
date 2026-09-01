// "ההמשך" — מה מציעים לקורא שסיים סיפור.
//
// הרקע (מדידה, 30 הימים שלפני 2026-09-01): 188 מתוך 310 ביקורים נכנסו ישר
// לעמוד סיפור (קישור מוואטסאפ), ו-60% מהצפיות בסיפור נגמרו ביציאה מהאתר.
// הקורא מסיים, רואה נקודת זהב — ואין לו לאן ללכת חוץ מ"סיפור אקראי", שהוא
// דלת עיוורת. הקובץ הזה בוחר עבורו סיפור הבא ורגע שמתאים לסיפור, בזמן הבנייה.
//
// הבחירה נעשית מהתוכן עצמו (תגיות, נושא, עולם), לא מהתנהגות של אנשים:
// אין שרת ואין מעקב אחרי אדם. מה שכן נזכר — בדפדפן של הקורא בלבד
// (localStorage) — הוא אילו סיפורים כבר קרא, כדי שלא יוצע לו שוב אותו סיפור.
//
// **בספרדית** התגיות והנושא חיים רק בקובץ העברי, ולכן הקרבה נמדדת דרך
// התאום העברי (אותו שם קובץ), והמועמדים והרגע נלקחים מהאוספים הספרדיים —
// רק מה שקיים בספרדית ("מבחר ולא מראה").
import type { CollectionEntry } from 'astro:content';
import { TAG_TO_FEELING, TOPIC_TO_FEELING } from '../data/story-moment-links';
import type { FeelingSlug } from '../data/feelings';
import { newestFirst } from './sort';

type HeStory = CollectionEntry<'stories'>;
type AnyStory = CollectionEntry<'stories'> | CollectionEntry<'storiesEs'>;
type AnyMoment = CollectionEntry<'moments'> | CollectionEntry<'momentsEs'>;

/** התגיות והנושא של סיפור — מהקובץ העברי; לסיפור ספרדי, דרך התאום. */
function meta(story: AnyStory, hebrew?: HeStory[]): { tags: string[]; topic?: string } {
  const source: AnyStory | undefined =
    'tags' in story.data ? story : (hebrew?.find((h) => h.id === story.id) ?? story);
  const data = source.data as { tags?: string[]; topic?: string };
  return { tags: (data.tags ?? []).map((t) => t.trim()), topic: data.topic };
}

/** המצב בפינת הרגעים שהסיפור הכי קרוב אליו, לפי תגיות (ואז נושא). */
export function feelingForStory(story: AnyStory, hebrew?: HeStory[]): FeelingSlug | null {
  const { tags, topic } = meta(story, hebrew);
  let best: { feeling: FeelingSlug; weight: number } | null = null;
  for (const tag of tags) {
    const link = TAG_TO_FEELING[tag];
    // תיקו → הראשון בסדר התגיות (הכותב שם את העיקר ראשון).
    if (link && (!best || link.weight > best.weight)) best = link;
  }
  if (best) return best.feeling;
  return topic ? TOPIC_TO_FEELING[topic as keyof typeof TOPIC_TO_FEELING] : null;
}

export interface NextStory<T extends AnyStory = AnyStory> {
  story: T;
  /** שורת "למה דווקא הוא" — התגית המשותפת, או העולם השונה. */
  reason: string;
}

/**
 * שלושה מועמדים ל"סיפור הבא", מהטוב ביותר ומטה. העמוד מציג את הראשון;
 * הסקריפט בצד הקורא מגריל בכל טעינה אחד מבין אלה שטרם נקראו (localStorage).
 *
 * הניקוד: תגית משותפת ×3 · אותו נושא +2 · אותו מצב ברגעים +2 · עולם אחר +1
 * (מעט גיוון: מי שנכנס דרך משל יגלה שיש גם יומן). תיקו — החדש קודם.
 */
export function nextStories<T extends AnyStory>(
  current: T,
  all: T[],
  sectionLabels: Record<string, string>,
  hebrew?: HeStory[]
): NextStory<T>[] {
  const es = !('tags' in current.data);
  const mine = meta(current, hebrew);
  const myTags = new Set(mine.tags);
  const myFeeling = feelingForStory(current, hebrew);
  const scored = all
    .filter((s) => s.id !== current.id)
    .map((story) => {
      const theirs = meta(story, hebrew);
      const shared = theirs.tags.filter((t) => myTags.has(t));
      let score = shared.length * 3;
      if (mine.topic && theirs.topic === mine.topic) score += 2;
      if (myFeeling && feelingForStory(story, hebrew) === myFeeling) score += 2;
      const otherWorld = story.data.section !== current.data.section;
      if (otherWorld) score += 1;
      const world = sectionLabels[story.data.section];
      // בספרדית התגיות עבריות ואינן מוצגות — השורה מדברת על העולם בלבד.
      const reason = es
        ? shared.length > 0
          ? 'Sobre lo mismo, desde otro ángulo'
          : otherWorld
            ? `De otro mundo: ${world}`
            : `Más de ${world}`
        : shared.length > 0
          ? `גם הוא על ${shared.slice(0, 2).join(' ועל ')}`
          : otherWorld
            ? `מעולם אחר: ${world}`
            : `עוד מ${world}`;
      return { story, score, reason };
    })
    .sort((a, b) => b.score - a.score || newestFirst(a.story, b.story));
  return scored.slice(0, 3).map(({ story, reason }) => ({ story, reason }));
}

/**
 * רגע אחד למצב של הסיפור. הבחירה בין שלושת רגעי המדף קבועה לכל סיפור
 * (לפי שם הקובץ), כך ששני סיפורים על אמונה לא יציעו בהכרח את אותו רגע.
 */
export function momentForStory<M extends AnyMoment>(
  current: AnyStory,
  moments: M[],
  hebrew?: HeStory[]
): M | null {
  const feeling = feelingForStory(current, hebrew);
  if (!feeling) return null;
  const shelf = moments.filter((m) => m.data.feeling === feeling).sort(newestFirst);
  if (shelf.length === 0) return null;
  let hash = 0;
  for (const ch of current.id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return shelf[hash % shelf.length];
}
