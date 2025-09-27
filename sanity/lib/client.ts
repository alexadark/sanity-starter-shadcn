import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: (() => {
    // Use custom domain if provided, otherwise use Vercel's automatic URL
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : undefined);

    return siteUrl
      ? {
          studioUrl: `${siteUrl}/studio`,
        }
      : undefined;
  })(),
});
