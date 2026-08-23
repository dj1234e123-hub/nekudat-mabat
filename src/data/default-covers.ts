// שערים זמניים לפי קטגוריה — לסיפורים שעדיין אין להם תמונת שער ייעודית.
// PNG (מומר מקובצי ה-SVG שלצידם) כדי שתצוגה מקדימה בוואטסאפ תעבוד — וואטסאפ לא מציג SVG.
import type { ImageMetadata } from 'astro';
import empowerment from '../assets/covers/default-empowerment.png';
import shabbat from '../assets/covers/default-shabbat.png';
import baalShemTov from '../assets/covers/default-baal-shem-tov.png';
import type { SectionSlug } from './sections';

export const DEFAULT_COVERS: Record<SectionSlug, ImageMetadata> = {
  meshalim: empowerment,
  tzadikim: baalShemTov,
  yoman: empowerment,
  shabbat,
};

export const DEFAULT_COVER_ALT = 'איור שער זמני בצבעי נקודת מבט';
