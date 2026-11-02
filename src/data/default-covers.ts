// שער זמני לסיפור שעדיין אין לו תמונת שער ייעודית: צילום השער של העולם שלו.
// אותה תמונה שמוצגת בדף הבית ובראש עמוד העולם (src/data/section-gate-images.ts),
// כך שסיפור בלי שער נראה כמו שייך לעולמו ולא כמו תקלה. החלפה: הוספת `cover` לסיפור.
// שבת – עולם שמור, ללא צילום: נשאר השער האיורי הישן (PNG, כדי שוואטסאפ יציג תצוגה מקדימה).
import type { ImageMetadata } from 'astro';
import shabbat from '../assets/covers/default-shabbat.png';
import { SECTION_GATE_IMAGES } from './section-gate-images';
import type { SectionSlug } from './sections';

const gate = (slug: SectionSlug): ImageMetadata => SECTION_GATE_IMAGES[slug]!.image;

export const DEFAULT_COVERS: Record<SectionSlug, ImageMetadata> = {
  meshalim: gate('meshalim'),
  tzadikim: gate('tzadikim'),
  yoman: gate('yoman'),
  chaim: gate('chaim'),
  shabbat,
};

export const DEFAULT_COVER_ALT = 'תמונת שער זמנית של העולם שאליו שייך הסיפור';
export const DEFAULT_COVER_ALT_ES = 'Portada provisional del mundo al que pertenece la historia';
