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
  return lang === 'es' ? `unos ${minutes} minutos de lectura` : `כ־${minutes} דקות קריאה`;
}
