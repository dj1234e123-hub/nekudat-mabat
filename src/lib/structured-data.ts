// נתונים מובנים (JSON-LD) — התיאור שגוגל קורא כדי להבין מה יש בעמוד.
// המבנה כאן מכוון למינימום ההכרחי: מי כתב, מה זה, ומתי. בלי שדות שאין להם כיסוי אמיתי.
import { SITE } from '../data/site';

/** מזהים קבועים — כתובת עם # מאפשרת לעמודים שונים להצביע על אותה ישות. */
const PERSON_ID = '/about/#person';
const SITE_ID = '/#website';

const abs = (path: string, site: URL) => new URL(path, site).href;

/** אפרים עטיה — אותה ישות בכל עמודי האתר. */
export function person(site: URL) {
  return {
    '@type': 'Person',
    '@id': abs(PERSON_ID, site),
    name: SITE.ownerName,
    url: abs('/about/', site),
    jobTitle: 'מאמן אישי ומלווה',
  };
}

/** דף הבית — האתר עצמו והאדם שמאחוריו. */
export function websiteJsonLd(site: URL, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs(SITE_ID, site),
    name: SITE.name,
    alternateName: SITE.slogan,
    url: abs('/', site),
    description,
    inLanguage: 'he-IL',
    author: person(site),
    publisher: person(site),
  };
}

/** עמוד סיפור או רגע — פריט כתוב אחד. */
export function articleJsonLd(
  site: URL,
  { url, headline, description, datePublished, image }: {
    url: string;
    headline: string;
    description: string;
    datePublished: Date;
    image?: string;
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: url,
    url,
    headline,
    description,
    inLanguage: 'he-IL',
    datePublished: datePublished.toISOString().slice(0, 10),
    author: person(site),
    publisher: person(site),
    isPartOf: { '@id': abs(SITE_ID, site) },
    ...(image ? { image } : {}),
  };
}

/** עמוד האודות — עמוד שכולו על אדם אחד. */
export function profileJsonLd(site: URL, description: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs('/about/', site),
    inLanguage: 'he-IL',
    isPartOf: { '@id': abs(SITE_ID, site) },
    mainEntity: {
      ...person(site),
      description,
      knowsLanguage: 'he-IL',
      ...(image ? { image } : {}),
    },
  };
}
