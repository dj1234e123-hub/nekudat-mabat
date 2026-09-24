// כרטיס השיתוף הגבוה של רגע (1080x1920) – התמונה שמשתפים בוואטסאפ ובסטטוס.
// /moments/<מצב>/<רגע>/card.png
// og.png באותה תיקייה נשאר לתצוגה המקדימה של קישור (4:5), שם תמונה גבוהה נחתכת.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMomentStory } from '../../../../lib/moment-card';
import { isPublished } from '../../../../lib/published';

export async function getStaticPaths() {
  const moments = await getCollection('moments', isPublished);
  return moments.map((moment) => ({
    params: { feeling: moment.data.feeling, slug: moment.id },
    props: { body: moment.body ?? '', title: moment.data.title, handle: moment.data.handle ?? null },
  }));
}

export const GET: APIRoute = ({ props, site }) => {
  const png = renderMomentStory(props.body as string, site!.host, props.title as string, props.handle as string | null);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
