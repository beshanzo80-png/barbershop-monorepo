import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/auth/', '/appointments/', '/profile/', '/settings/', '/booking/', '/_next/', '/*.json$'],
    },
    sitemap: 'https://premiumbarber.com/sitemap.xml',
    crawlDelay: 10,
  };
}