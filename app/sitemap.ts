import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 静态路由列表
  const staticRoutes = [
    { path: '/', priority: 1.0 },
    { path: '/pricing', priority: 0.8 },
    { path: '/pricing/success', priority: 0.7 },
    { path: '/contact', priority: 0.7 },
    { path: '/privacy', priority: 0.6 },
    { path: '/terms', priority: 0.6 },
    { path: '/auth/auth-code-error', priority: 0.5 },
  ];

  // 生成sitemap条目
  const sitemapEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));

  return sitemapEntries;
}