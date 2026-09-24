// כתובות ספרדיות בספרדית.
//
// **הבעיה שזה פותר:** עד 2026-09-22 הכתובות הספרדיות נשאו את שם הקובץ
// העברי המשועתק – `/es/historias/tzaif-zahov/`. לקורא מקסיקני זו ג'יבריש,
// ולגוגל היא לא אומרת דבר על מה שכתוב בעמוד. עכשיו:
// `/es/historias/el-panuelo-dorado/`.
//
// **למה מפה ולא שם קובץ:** הזיווג בין העברית לספרדית נעשה **לפי שם הקובץ**
// (גלולת השפה, hreflang, NextUp, תמונות השיתוף). שינוי שמות הקבצים היה
// שובר את כל אלה. לכן שם הקובץ נשאר עוגן פנימי, והמפה קובעת את הכתובת
// הציבורית בלבד.
//
// **כלל הכתיבה:** ASCII בלבד (בלי תווים מוטעמים ובלי ñ), אותיות קטנות,
// מקפים. הסלאג נגזר מהכותרת הספרדית, ומותר לקצר כותרת ארוכה – הוא כתובת,
// לא תרגום.
//
// **מלכודת שנמנעה:** "Cien años de retraso" היה הופך ל-`cien-anos-de-retraso`,
// ו"anos" בלי ñ אינה "שנים" בספרדית אלא מילה גסה. במקום תעתיק עקום
// (`anios`) נבחר ניסוח ספרדי תקין: `un-siglo-de-retraso`.
//
// **הוספת סיפור ספרדי חדש = שורה אחת כאן.** סיפור בלי שורה מכשיל את
// הבנייה (ראו assertEsSlugs) – כתובת עברית שנכנסת בשקט היא בדיוק הבאג
// שהמפה הזאת נועדה לסגור.
//
// **הרגעים לא נכללים בכוונה:** 109 עמודים שאספו 36 צפיות ב-90 יום.
// 109 הפניות הן סיכון בלי תמורה. אם הפינה תתעורר – המנגנון כאן מוכן.

/** שם הקובץ באוסף storiesEs ← הסלאג הציבורי בספרדית. */
export const ES_STORY_SLUGS: Record<string, string> = {
  '001-kvar-hechlateti-mi-hem': 'ya-habia-decidido-quienes-eran',
  '005-mitachat-lakash-beauschwitz': 'bajo-la-paja-en-auschwitz',
  '006-hayeled-im-hamatos': 'el-chico-del-avion-de-papel',
  '007-hayeled-sheasaf-bulim': 'el-nino-que-juntaba-estampillas',
  '008-lo-ratziti-lachzor-habaita': 'no-queria-volver-a-casa',
  '009-eifo-hitchil-hasipur-haze': 'donde-empezo-esta-historia',
  '010-lama-hu-bachar-rachok': 'por-que-estacionaba-lejos',
  '011-lo-lesham-hu-hitkaven': 'no-era-ahi-adonde-iba',
  '013-ani-hayachid-shelo-nigash': 'el-unico-que-no-se-acerco',
  '014-nishar-li-rak-hashem-sheli': 'solo-me-quedo-mi-nombre',
  '017-mivrak-le-atzmecha': 'el-telegrama-que-te-enviaste',
  // הכותרת המלאה ("El puente que la cabeza no se anima a cruzar") ארוכה
  // מדי לכתובת שנשלחת בוואטסאפ; הסלאג שומר את שלוש מילות המפתח.
  '020-hagesher-shehrosh-mefached': 'el-puente-que-la-cabeza-no-cruza',
  '026-lev-mishtarot-shel-zman': 'no-rompio-dinero',
  '030-lishbor-kedei-lehishtachrer': 'romper-para-liberarse',
  '037-hasipur-shesipru-lanesher': 'la-historia-que-le-contaron-al-aguila',
  '038-ani-maamin-mehakaron': 'el-ani-maamin-del-vagon',
  '042-delet-bekoma-shivim': 'una-puerta-en-el-piso-setenta',
  '048-milimeter-echad-shel-ometz': 'un-milimetro-de-coraje',
  '050-hamelech-roeh-et-halev': 'el-rey-ve-el-corazon',
  'betzad-hasheni-shel-hahar': 'al-otro-lado-de-la-montana',
  'chamishim-chamishim': 'cincuenta-cincuenta',
  'habricha-hamushlemet': 'la-fuga-perfecta',
  'hasandlar-shekimat-haya': 'el-zapatero-que-casi-fue',
  'hatabaat-bakos': 'el-anillo-en-el-vaso-de-carton',
  'im-lo-lemala-mize': 'si-no-mas-arriba',
  'im-tisrod': 'si-sobrevives',
  'kedei-levade-shesalachti': 'para-estar-seguro-de-que-perdone',
  'lama-korim-li-efraim': 'por-que-me-llamo-efraim',
  'ma-ata-rotze-bachayim': 'que-quieres-hacer-con-tu-vida',
  'maasar-haolam-shela': 'su-cadena-perpetua',
  // ראו הערת "anos" למעלה.
  'meah-shana-beichur': 'un-siglo-de-retraso',
  'nipagesh-beseptember': 'nos-vemos-el-uno-de-septiembre',
  'shiur-al-srochim': 'una-leccion-sobre-cordones',
  'tzaif-zahov': 'el-panuelo-dorado',
};

/** עולם תוכן ← הסלאג הספרדי שלו.
    "tzadikim" אינו מתורגם בכוונה: התווית הספרדית עצמה היא
    "Historias de tzadikim", ולכן המילה הזאת כבר חיה בספרדית של האתר. */
export const ES_SECTION_SLUGS: Record<string, string> = {
  meshalim: 'parabolas',
  tzadikim: 'tzadikim',
  yoman: 'mi-diario',
  chaim: 'de-la-vida',
};

/** הכתובת הציבורית של סיפור ספרדי. */
export function esStoryPath(id: string): string {
  return `/es/historias/${ES_STORY_SLUGS[id] ?? id}/`;
}

/** הכתובת הציבורית של עמוד עולם ספרדי. */
export function esSectionPath(section: string): string {
  return `/es/secciones/${ES_SECTION_SLUGS[section] ?? section}/`;
}

/** מכשיל את הבנייה כשסיפור ספרדי שפורסם אין לו סלאג – אחרת הוא היה
    מקבל כתובת עברית בשקט, וזה בדיוק הבאג שהמפה סוגרת. */
export function assertEsSlugs(ids: readonly string[]): void {
  const missing = ids.filter((id) => !ES_STORY_SLUGS[id]);
  if (missing.length) {
    throw new Error(
      `[es-slugs] סיפורים ספרדיים בלי סלאג ספרדי: ${missing.join(', ')}\n` +
        `הוסיפו שורה ב-src/data/es-slugs.ts (וגם הפניה מהכתובת הישנה ב-vercel.json, ` +
        `אם הכתובת הישנה כבר שותפה).`
    );
  }
  const seen = new Map<string, string>();
  for (const [id, slug] of Object.entries(ES_STORY_SLUGS)) {
    const prev = seen.get(slug);
    if (prev) throw new Error(`[es-slugs] סלאג כפול "${slug}": ${prev} ו-${id}`);
    seen.set(slug, id);
  }
}
