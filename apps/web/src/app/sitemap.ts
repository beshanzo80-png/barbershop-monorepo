import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://premiumbarber.com';

  const staticRoutes = [
    '',
    '/services',
    '/auth/login',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In production, fetch dynamic routes from database
  // const dynamicRoutes = await getDynamicRoutes();

  return [...staticRoutes];
}