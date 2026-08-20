const formatter = new Intl.DateTimeFormat('he-IL', { dateStyle: 'long' });

export function formatDate(date: Date): string {
  return formatter.format(date);
}
