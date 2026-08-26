// תמונת השיתוף של רגע בספרדית — אותו צינור כמו העברי, במצב LTR:
// /es/momentos/<מצב>/<רגע>/og.png
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMomentCard } from '../../../../../lib/moment-card';

export async function getStaticPaths() {
  const moments = await getCollection('momentsEs');
  return moments.map((moment) => ({
    params: { feeling: moment.data.feeling, slug: moment.id },
    props: { body: moment.body ?? '', title: moment.data.title },
  }));
}

export const GET: APIRoute = ({ props, site }) => {
  const png = renderMomentCard(props.body as string, site!.host, props.title as string, 'es');
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
