// נתונים מובנים (JSON-LD) — התיאור שגוגל קורא כדי להבין מה יש בעמוד.
// המבנה כאן מכוון למינימום ההכרחי: מי כתב, מה זה, ומתי. בלי שדות שאין להם כיסוי אמיתי.
import { getImage } from 'astro:assets';
import logo from '../assets/logo.jpg';
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

/** דף הבית — האתר עצמו והאדם שמאחוריו.
    image הוא הלוגו האמיתי (לא תמונת "עין" זמנית) — סימן נוסף לגוגל
    על זהות המותג, מעבר ל-favicon. */
export async function websiteJsonLd(site: URL, description: string) {
  const logoImage = await getImage({ src: logo, width: 640, format: 'jpeg' });
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs(SITE_ID, site),
    name: SITE.name,
    alternateName: SITE.slogan,
    url: abs('/', site),
    description,
    image: abs(logoImage.src, site),
    inLanguage: 'he-IL',
    author: person(site),
    publisher: person(site),
  };
}

/** עמוד סיפור או רגע — פריט כתוב אחד. */
export function articleJsonLd(
  site: URL,
  { url, headline, description, datePublished, image, inLanguage = 'he-IL' }: {
    url: string;
    headline: string;
    description: string;
    datePublished: Date;
    image?: string;
    /** רגע ספרדי מצהיר es — אותו מחבר, שפה אחרת. */
    inLanguage?: string;
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: url,
    url,
    headline,
    description,
    inLanguage,
    datePublished: datePublished.toISOString().slice(0, 10),
    author: person(site),
    publisher: person(site),
    isPartOf: { '@id': abs(SITE_ID, site) },
    ...(image ? { image } : {}),
  };
}

/** נתיב פירורי לחם (Breadcrumb) — ההיררכיה שגוגל יכול להציג בתוצאת החיפוש
    במקום כתובת גולמית. הפריט האחרון (העמוד הנוכחי) נשאר בלי path, לפי
    המוסכמה של גוגל לפריט הסופי ברשימה. */
export function breadcrumbJsonLd(site: URL, items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: abs(item.path, site) } : {}),
    })),
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
