// תמונות חמשת השערים — צילומים של בעל הפרויקט (2026-08-25).
//
// דפוס הסדרה: אור אחד קטן בתוך שדה גדול ושקט, שהולך ומתקרב משער לשער —
// חלון דולק בשקיעה → השתקפותו במים → פנס בקצה שביל בערפל → אור שנכנס
// בדלת פתוחה → כוכב בשמי הלילה. בלי דמויות.
//
// החלפת תמונה: קובץ חדש ב-src/assets/gates/<slug>.jpg. המפה כאן משרתת גם
// את רכיב השער (GateArt) וגם את תמונת השיתוף של עמוד השער.
import hurting from '../assets/gates/hurting.jpg';
import self from '../assets/gates/self.jpg';
import stuck from '../assets/gates/stuck.jpg';
import beginning from '../assets/gates/beginning.jpg';
import upward from '../assets/gates/upward.jpg';
import type { GroupSlug } from './feelings';
import type { ImageMetadata } from 'astro';

export const GATE_IMAGES: Record<GroupSlug, ImageMetadata> = {
  hurting,
  self,
  stuck,
  beginning,
  upward,
};
