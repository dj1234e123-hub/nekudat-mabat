const formatters = {
  he: new Intl.DateTimeFormat('he-IL', { dateStyle: 'long' }),
  // תאריך בעמוד ספרדי — באותו סגנון, בשפת הקורא.
  es: new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }),
} as const;

export function formatDate(date: Date, lang: 'he' | 'es' = 'he'): string {
  return formatters[lang].format(date);
}
