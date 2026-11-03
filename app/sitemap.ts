import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { articles } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/dogs', '/cats', '/knowledge', '/marketplace', '/shop', '/advertise', '/community', '/trust', '/contact'].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    }),
  );

  const articleRoutes = articles.map((article) => ({
    url: `${site.url}/knowledge/${article.slug}`,
    lastModified: new Date(article.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
