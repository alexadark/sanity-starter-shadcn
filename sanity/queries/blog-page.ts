import { groq } from 'next-sanity';
import { imageQuery } from './shared/image';

export const BLOG_PAGE_QUERY = groq`*[_type == "blog-page"][0]{
  title,
  subtitle,
  heroImage{
    ${imageQuery}
  },
  meta_title,
  meta_description,
  noindex,
  ogImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
  }
}`;
