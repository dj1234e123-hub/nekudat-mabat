// תמונות הזהות של שערי הפינות השבועיות (שלב 4.99).
// מעשה שהיה – ההבדלה (יציאת השבת). מבט לשבת – הזוג שלה: נרות שבת באותה נקודה
// (כניסת השבת). פריט בלי תמונה מוצג בשער בלי תמונה ולא נשבר.
// הוספה: קובץ ב-src/assets/mabat-leshabbat/ ושורה כאן.
import type { ImageMetadata } from 'astro';
import havdala from '../assets/besht/havdala.png';
import candles from '../assets/mabat-leshabbat/shabbat-candles.jpg';

export interface Cover {
  src: ImageMetadata;
  alt: string;
  altEs: string;
}

export const CORNER_COVERS: { mabat?: Cover; besht?: Cover } = {
  mabat: {
    src: candles,
    alt: 'שני נרות שבת דולקים בפמוטי כסף על מעקה אבן, לידם חלה מכוסה במפה רקומה, ומאחור בתי אבן של ירושלים באור של לפני השקיעה',
    altEs: 'Dos velas de Shabat encendidas en candelabros de plata sobre un muro de piedra, junto a una jalá cubierta con un mantel bordado, y detrás casas de piedra de Jerusalén con la luz de antes del atardecer',
  },
  besht: {
    src: havdala,
    alt: 'נר הבדלה קלוע ודולק על מעקה אבן, לצידו גביע כסף וקופסת בשמים, ומאחור נוף ירושלים באור שקיעה',
    altEs: 'Una vela trenzada de Havdalá encendida sobre un muro de piedra, junto a una copa de plata y una cajita de especias, con Jerusalén al atardecer de fondo',
  },
};
