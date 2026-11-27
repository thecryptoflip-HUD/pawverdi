import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { journalDate, journalStories } from '@/lib/journal';
import { articles } from '@/lib/content';
import { collections, getItems } from '@/lib/discovery';
import { readPublicEntries } from '@/lib/publication';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items, entries] = await Promise.all([getItems(), readPublicEntries()]);
  const pages = [
    '', '/dogs', '/cats', '/knowledge', '/marketplace', '/shop', '/advertise',
    '/community', '/trust', '/contact', '/discover', '/discover/published', '/deals',
    '/journal', '/about', '/faq', '/privacy', '/terms', '/affiliate-disclosure',
    '/advertising-disclosure', '/editorial-standards', '/accessibility', '/partners', '/media-kit',
    ...collections.map(({ slug }) => '/discover/' + slug),
    ...items.map(({ slug }) => '/products/' + slug),
  ];
  return [
    ...pages.map(path => ({ url: site.url + path })),
    ...journalStories.map(story => ({ url: site.url + '/journal/' + story.slug, lastModified: new Date(journalDate) })),
    ...articles.filter(article => article.guide).map(article => ({
      url: site.url + '/knowledge/' + article.slug, lastModified: new Date(article.updated),
    })),
    ...entries.filter(entry => entry.kind !== 'product').map(entry => ({
      url: site.url + '/discover/published/' + entry.slug, lastModified: new Date(entry.updated_at),
    })),
  ];
}
