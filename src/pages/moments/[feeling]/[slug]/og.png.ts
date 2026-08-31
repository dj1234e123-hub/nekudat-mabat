// תמונת השיתוף של רגע בודד. נוצרת בזמן הבנייה ונשמרת כקובץ סטטי לצד העמוד:
// /moments/<מצב>/<רגע>/og.png
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMomentCard } from '../../../../lib/moment-card';
import { isPublished } from '../../../../lib/published';

export async function getStaticPaths() {
  const moments = await getCollection('moments', isPublished);
  return moments.map((moment) => ({
    params: { feeling: moment.data.feeling, slug: moment.id },
    props: { body: moment.body ?? '', title: moment.data.title ?? null },
  }));
}

export const GET: APIRoute = ({ props, site }) => {
  const png = renderMomentCard(props.body as string, site!.host, props.title as string | null);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
