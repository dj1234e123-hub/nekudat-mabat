// תמונות השער של עולמות הסיפורים — צילומים שבעל הפרויקט מעלה אחד-אחד.
//
// המפה משרתת גם את דלת הסיפורים בדף הבית וגם את ראש עמוד העולם — תמונה
// אחת, שני מקומות. עולם בלי תמונה מוצג עם ממלא-המקום עד שתגיע.
//
// position — נקודת המיקוד של החיתוך (object-position): איפה נושא הצילום
// יושב בתוך הפריים, כדי שהחיתוך לא יבלע אותו. תכונה של הצילום, ולכן היא
// חיה כאן ולא ב-CSS של עמוד מסוים.
// החלפה/הוספה: קובץ ב-src/assets/gates/ ושורה אחת כאן.
import meshalim from '../assets/gates/stories-red.png';
import yoman from '../assets/gates/stories-blue.png';
import type { SectionSlug } from './sections';
import type { ImageMetadata } from 'astro';

export interface SectionGateImage {
  image: ImageMetadata;
  position: string;
}

export const SECTION_GATE_IMAGES: Partial<Record<SectionSlug, SectionGateImage>> = {
  meshalim: { image: meshalim, position: '62% 42%' },
  // היומן הפתוח והעט הם הנושא — החיתוך יורד מעט מטה, אל השולחן
  yoman: { image: yoman, position: '50% 62%' },
};
