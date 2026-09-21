import type { MetadataRoute } from 'next';

import { getProductSlugs } from '@/lib/products/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProductSlugs();

  const entries: MetadataRoute.Sitemap = [];

  // Arabic homepage
  entries.push({
    url: `${siteUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });

  // English homepage
  entries.push({
    url: `${siteUrl}/en`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });

  // Arabic shop
  entries.push({
    url: `${siteUrl}/shop`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // English shop
  entries.push({
    url: `${siteUrl}/en/shop`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // Product pages
  for (const product of products) {
    entries.push({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    entries.push({
      url: `${siteUrl}/en/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return entries;
}
