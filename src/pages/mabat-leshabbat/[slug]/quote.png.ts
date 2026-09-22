// תמונת הציטוט של גיליון "מבט לשבת". נוצרת בזמן הבנייה ונשמרת כקובץ סטטי
// לצד העמוד: /mabat-leshabbat/<גיליון>/quote.png
//
// נוצרת רק לגיליון שנושא שדה `quote`. גיליון עם `quoteImage` (קובץ PNG
// מוכן בריפו) ממשיך כפי שהוא — ההגירה היא קובץ-קובץ.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderQuoteCard } from '../../../lib/quote-card';
import { isPublished } from '../../../lib/published';

export async function getStaticPaths() {
  const pieces = await getCollection('mabatLeshabbat', isPublished);
  return pieces
    .filter((piece) => piece.data.quote?.length)
    .map((piece) => ({ params: { slug: piece.id }, props: { quote: piece.data.quote! } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const png = renderQuoteCard(props.quote as string[], site!.host);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
