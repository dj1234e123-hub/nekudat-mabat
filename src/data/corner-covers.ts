// תמונות הזהות של שערי הפינות השבועיות (שלב 4.99).
// מעשה שהיה – ההבדלה (יציאת השבת). מבט לשבת – הזוג שלה: נרות שבת באותה נקודה
// (כניסת השבת). עד שתהיה תמונה, השער של מבט לשבת מוצג בלי תמונה ולא נשבר.
// הוספה: קובץ ב-src/assets/mabat-leshabbat/ ושורה כאן.
import type { ImageMetadata } from 'astro';
import havdala from '../assets/besht/havdala.png';

export interface Cover {
  src: ImageMetadata;
  alt: string;
  altEs: string;
}

export const CORNER_COVERS: { mabat?: Cover; besht?: Cover } = {
  besht: {
    src: havdala,
    alt: 'נר הבדלה קלוע ודולק על מעקה אבן, לצידו גביע כסף וקופסת בשמים, ומאחור נוף ירושלים באור שקיעה',
    altEs: 'Una vela trenzada de Havdalá encendida sobre un muro de piedra, junto a una copa de plata y una cajita de especias, con Jerusalén al atardecer de fondo',
  },
};
