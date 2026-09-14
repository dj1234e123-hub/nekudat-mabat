// זמן קריאה: מכרטיס הסיפור אם צוין, אחרת לפי ספירת מילים (~180 מילים לדקה).
// חי כאן פעם אחת כי גם עמוד הסיפור וגם כרטיס "הסיפור הבא" מציגים אותו.
interface StoryLike {
  body?: string;
  data: { readingTime?: string };
}

export function readingLabel(story: StoryLike, lang: 'he' | 'es' = 'he'): string {
  if (story.data.readingTime) {
    return lang === 'es' ? `${story.data.readingTime} de lectura` : `${story.data.readingTime} קריאה`;
  }
  const wordCount = (story.body ?? '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 180));
  // דקה אחת: "כ־1 דקות" אינו עברית. נחשף בסיפור הראשון שקצר מ-270 מילים (2026-09-14).
  if (minutes === 1) {
    return lang === 'es' ? 'un minuto de lectura' : 'כדקת קריאה';
  }
  return lang === 'es' ? `unos ${minutes} minutos de lectura` : `כ־${minutes} דקות קריאה`;
}
