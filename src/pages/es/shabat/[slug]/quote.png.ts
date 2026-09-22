// תמונת הציטוט של גיליון ספרדי — אותו צינור כמו העברי, במצב LTR:
// /es/shabat/<גיליון>/quote.png
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderQuoteCard } from '../../../../lib/quote-card';
import { isPublished } from '../../../../lib/published';

export async function getStaticPaths() {
  const pieces = await getCollection('mabatEs', isPublished);
  return pieces
    .filter((piece) => piece.data.quote?.length)
    .map((piece) => ({ params: { slug: piece.id }, props: { quote: piece.data.quote! } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const png = renderQuoteCard(props.quote as string[], site!.host, 'es');
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
