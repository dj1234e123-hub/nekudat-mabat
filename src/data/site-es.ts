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
