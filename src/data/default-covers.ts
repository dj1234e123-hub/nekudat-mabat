// שערים זמניים לפי קטגוריה — לסיפורים שעדיין אין להם תמונת שער ייעודית.
import type { ImageMetadata } from 'astro';
import empowerment from '../assets/covers/default-empowerment.svg';
import shabbat from '../assets/covers/default-shabbat.svg';
import baalShemTov from '../assets/covers/default-baal-shem-tov.svg';
import type { SectionSlug } from './sections';

export const DEFAULT_COVERS: Record<SectionSlug, ImageMetadata> = {
  empowerment,
  shabbat,
  'baal-shem-tov': baalShemTov,
};

export const DEFAULT_COVER_ALT = 'איור שער זמני בצבעי נקודת מבט';
