// האזור הספרדי — מחרוזות הממשק ותוויות המצבים.
//
// עיקרון: **מבחר ולא מראה.** האזור הספרדי אינו מחויב לשקף את האתר העברי.
// תוכן מתורגם עולה לפי בחירה; מה שאין — פשוט לא קיים שם, ואין חוב.
//
// שם המותג בספרדית: "Punto de Vista" — התרגום המילולי של "נקודת מבט",
// ולכן הוא נושא את אותה משמעות בדיוק ולא רק תעתיק של הצליל.
//
// חשוב: בעל הפרויקט **אינו מאמן בספרדית**. לכן אין באזור הזה שום הזמנה
// לשיחה אישית — הזמנה לשיחה שאי אפשר לקיים מייצרת רושם של מי שלא עונה.

export const SITE_ES = {
  name: 'Punto de Vista',
  slogan: 'Ponemos el punto en el centro',
  ownerName: 'Efraim Atia',
  /** קבוצת הוואטסאפ הספרדית — ערוץ נפרד לחלוטין מהקבוצה העברית.
      נמסר ע"י בעל הפרויקט 2026-08-30 (נשמר בלי פרמטר ה-mode של מסך ההעתקה). */
  whatsappGroupUrl: 'https://chat.whatsapp.com/Guowx1In317DPruSb0iylo',
} as const;

/** עולמות הסיפורים בספרדית — תווית, שורה וקישור, לפי אותו slug של sections.ts.
    התרגום שומר על העיקרון "השורה מסבירה ולא רומזת" — היא גם תיאור המטא בגוגל. */
export const SECTIONS_ES: Record<string, { label: string; line: string; linkText: string }> = {
  meshalim: {
    label: 'Parábolas',
    line: 'Un rey, un puente, un águila. Ninguno existió — y justo por eso es más fácil verte en ellos.',
    linkText: 'Todas las parábolas',
  },
  tzadikim: {
    label: 'Historias de tzadikim',
    line: 'Ni milagros ni prodigios. Un pequeño momento en el que un gran hombre hizo lo que hizo — y ahí está todo.',
    linkText: 'Todas las historias de tzadikim',
  },
  yoman: {
    label: 'De mi diario',
    line: 'No son historias que escuché. Cosas que viví de cerca — incluso las que no me dejan bien parado.',
    linkText: 'Todo el diario',
  },
};

/** "מבט לשבת" בספרדית — שם הפינה ומחרוזות הקבע שלה. */
export const MABAT_ES = {
  name: 'Mirada de Shabat',
  parashaPrefix: 'Parashá',
} as const;

/** תוויות המצבים בספרדית — מפתח לפי אותו slug של הרשימה העברית. */
export const FEELING_LABELS_ES: Record<string, string> = {
  pain: 'Dolor',
  sadness: 'Tristeza',
  loneliness: 'Soledad',
  loss: 'Pérdida',
  anger: 'Enojo',
  guilt: 'Culpa',
  shame: 'Vergüenza',
  envy: 'Envidia',
  secret: 'Secreto',
  'losing-control': 'Falta de control',
  fear: 'Miedo',
  confusion: 'Confusión',
  pressure: 'Presión',
  failure: 'Fracaso',
  standstill: 'Estancamiento',
  exhaustion: 'Agotamiento',
  waiting: 'Espera',
  hope: 'Esperanza',
  'new-beginning': 'Volver a empezar',
  faith: 'Fe',
  confidence: 'Confianza en uno mismo',
  'good-moment': 'Un buen momento',
  prayer: 'Oración',
  providence: 'Providencia',
  gratitude: 'Gratitud',
};

/** כותרות הקבוצות בספרדית — לפי אותו slug של הרשימה העברית. */
export const GROUP_LABELS_ES: Record<string, string> = {
  hurting: 'Cuando duele',
  self: 'Cuando cuesta contigo mismo',
  stuck: 'Cuando cuesta avanzar',
  beginning: 'Cuando algo se abre',
  upward: 'Cuando levantamos la mirada',
};

/** שורות השער בספרדית — "gate line" של כל קבוצה (feelings.ts: group.line).
    אותו עיקרון כמו בעברית: פוגשות, לא מתייגות ולא מסבירות. */
export const GROUP_LINES_ES: Record<string, string> = {
  hurting: 'Hay cosas que duelen en silencio.',
  self: 'Nadie te juzga como tú.',
  stuck: 'Las piernas quieren, y algo no se mueve.',
  beginning: 'No siempre se siente como luz.',
  upward: 'Incluso cuando no se siente nada.',
};

/** שורות הדלת בספרדית — "door line" של כל מצב (feelings.ts: feeling.line).
    התרגום שומר על המטרה ולא על המבנה: זיהוי ("esto me suena") בלי תיוג,
    ובניסוח שאינו ממגדר את הקורא (העיקרון מהחלטת "נוסח מגדרי בספרדית"). */
export const FEELING_LINES_ES: Record<string, string> = {
  pain: 'El tiempo pasó, y todavía está aquí.',
  sadness: 'Las cosas pequeñas se volvieron pesadas.',
  loneliness: 'Incluso con gente alrededor.',
  loss: 'Algo falta, todo el tiempo.',
  anger: 'Hierve por dentro, silencio por fuera.',
  guilt: 'Por lo que hiciste, y por lo que no.',
  shame: 'Sube de golpe, incluso años después.',
  envy: 'Te alegras por ellos. Casi.',
  secret: 'Va contigo a todas partes.',
  'losing-control': 'Verlo pasar, otra vez.',
  fear: 'Frente a la puerta, sin abrirla.',
  confusion: 'Todos los caminos se ven iguales.',
  pressure: 'El día se termina antes de empezar.',
  failure: 'Ese momento, en repetición.',
  standstill: 'Otra semana. Nada se mueve.',
  exhaustion: 'Levantarse por la mañana, ya esperando la noche.',
  waiting: 'Mirar el teléfono, otra vez.',
  hope: 'Todavía no pasó nada, y aun así.',
  'new-beginning': 'Página nueva. La mano tiembla un poco.',
  confidence: 'Saber la respuesta, y callar.',
  'good-moment': 'Quizás hoy hubo uno.',
  faith: 'Antes se sentía más simple.',
  prayer: 'Hablar, sin saber si alguien escucha.',
  providence: 'En medio de la historia, sin conocer el final.',
  gratitude: 'No siempre hay fuerzas para decir gracias.',
};
