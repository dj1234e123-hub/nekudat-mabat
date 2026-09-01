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
import type { CollectionEntry } from 'astro:content';
import { TAG_TO_FEELING, TOPIC_TO_FEELING } from '../data/story-moment-links';
import type { FeelingSlug } from '../data/feelings';
import { newestFirst } from './sort';

type Story = CollectionEntry<'stories'>;
type Moment = CollectionEntry<'moments'>;

/** זמן קריאה — אותו חישוב שבעמוד הסיפור (~180 מילים לדקה), או השדה הידני. */
export function readingLabel(story: Story): string {
  if (story.data.readingTime) return story.data.readingTime;
  const words = (story.body ?? '').trim().split(/\s+/).length;
  return `כ־${Math.max(1, Math.round(words / 180))} דקות`;
}

const tagsOf = (story: Story) => (story.data.tags ?? []).map((t) => t.trim());

/** המצב בפינת הרגעים שהסיפור הכי קרוב אליו, לפי תגיות (ואז נושא). */
export function feelingForStory(story: Story): FeelingSlug | null {
  let best: { feeling: FeelingSlug; weight: number } | null = null;
  for (const tag of tagsOf(story)) {
    const link = TAG_TO_FEELING[tag];
    // תיקו → הראשון בסדר התגיות (הכותב שם את העיקר ראשון).
    if (link && (!best || link.weight > best.weight)) best = link;
  }
  if (best) return best.feeling;
  return story.data.topic ? TOPIC_TO_FEELING[story.data.topic] : null;
}

export interface NextStory {
  story: Story;
  /** שורת "למה דווקא הוא" — התגית המשותפת, או העולם השונה. */
  reason: string;
}

/**
 * שלושה מועמדים ל"סיפור הבא", מהטוב ביותר ומטה. העמוד מציג את הראשון;
 * הסקריפט בצד הקורא מדלג על מה שכבר נקרא (localStorage) ומציג את הבא.
 *
 * הניקוד: תגית משותפת ×3 · אותו נושא +2 · אותו מצב ברגעים +2 · עולם אחר +1
 * (מעט גיוון: מי שנכנס דרך משל יגלה שיש גם יומן). תיקו — החדש קודם.
 */
export function nextStories(current: Story, all: Story[], sectionLabels: Record<string, string>): NextStory[] {
  const myTags = new Set(tagsOf(current));
  const myFeeling = feelingForStory(current);
  const scored = all
    .filter((s) => s.id !== current.id)
    .map((story) => {
      const shared = tagsOf(story).filter((t) => myTags.has(t));
      let score = shared.length * 3;
      if (current.data.topic && story.data.topic === current.data.topic) score += 2;
      if (myFeeling && feelingForStory(story) === myFeeling) score += 2;
      const otherWorld = story.data.section !== current.data.section;
      if (otherWorld) score += 1;
      const reason =
        shared.length > 0
          ? `גם הוא על ${shared.slice(0, 2).join(' ועל ')}`
          : otherWorld
            ? `מעולם אחר: ${sectionLabels[story.data.section]}`
            : `עוד מ${sectionLabels[story.data.section]}`;
      return { story, score, reason };
    })
    .sort((a, b) => b.score - a.score || newestFirst(a.story, b.story));
  return scored.slice(0, 3).map(({ story, reason }) => ({ story, reason }));
}

/**
 * רגע אחד למצב של הסיפור. הבחירה בין שלושת רגעי המדף קבועה לכל סיפור
 * (לפי שם הקובץ), כך ששני סיפורים על אמונה לא יציעו בהכרח את אותו רגע.
 */
export function momentForStory(current: Story, moments: Moment[]): Moment | null {
  const feeling = feelingForStory(current);
  if (!feeling) return null;
  const shelf = moments.filter((m) => m.data.feeling === feeling).sort(newestFirst);
  if (shelf.length === 0) return null;
  let hash = 0;
  for (const ch of current.id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return shelf[hash % shelf.length];
}
