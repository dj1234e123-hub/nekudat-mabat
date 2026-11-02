// מחרוזות הממשק של כרטיסי הסיפורים וארכיון הסיפורים, בשתי השפות.
// מקום אחד, כדי שהעברית והספרדית יישארו זהות במבנה (החלטת "הספרדית משקפת את העברית העדכנית").
export type Lang = 'he' | 'es';

export const STORY_UI = {
  he: {
    views: 'צפיות',
    isNew: 'חדש',
    read: '✓ קראת',
    stories: (n: number) => (n === 1 ? 'סיפור אחד' : `${n} סיפורים`),
    searchLabel: 'חפש סיפור, שאלה או נושא',
    sortLabel: 'מיון',
    sortNew: 'מהחדש לישן',
    sortTop: 'הכי נקראים',
    short: 'קצרים: עד 2 דקות',
    empty: 'לא נמצא סיפור כזה. נסה מילה אחרת, או נקה סינון.',
    more: (show: number, left: number) => `עוד ${show} סיפורים · נשארו ${left}`,
    remove: 'הסר סינון',
    all: 'הכול',
  },
  es: {
    views: 'vistas',
    isNew: 'nueva',
    read: '✓ leída',
    stories: (n: number) => (n === 1 ? 'una historia' : `${n} historias`),
    searchLabel: 'Busca una historia, una pregunta o un tema',
    sortLabel: 'Orden',
    sortNew: 'Más recientes',
    sortTop: 'Más leídas',
    short: 'Cortas: hasta 2 minutos',
    empty: 'No encontramos esa historia. Prueba con otra palabra o quita un filtro.',
    more: (show: number, left: number) => `${show} historias más · quedan ${left}`,
    remove: 'Quitar filtro',
    all: 'Todas',
  },
} as const;
