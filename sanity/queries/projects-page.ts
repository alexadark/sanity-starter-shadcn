import { groq } from 'next-sanity';
import { imageQuery } from './shared/image';

export const PROJECTS_PAGE_QUERY = groq`*[_type == "projects-page"][0]{
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
