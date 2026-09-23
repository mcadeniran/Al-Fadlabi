import type { MetadataRoute } from 'next';

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const siteUrl = new URL(
  configuredSiteUrl.startsWith('http')
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`,
).origin;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/cart/', '/checkout/', '/api/'],
    },

    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
