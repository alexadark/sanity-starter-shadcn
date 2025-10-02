import { groq } from 'next-sanity';
import { imageQuery } from './shared/image';

export const CATEGORY_QUERY = groq`*[_type == "category" && slug.current == $slug][0]{
  title,
  slug,
  description,
  image{
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

export const CATEGORY_PROJECTS_PAGINATED_QUERY = groq`{
  "category": *[_type == "category" && slug.current == $slug][0]{
    title,
    slug,
    description,
    image{
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
  },
  "projects": *[_type == "project" && defined(slug) && references(*[_type == "category" && slug.current == $slug][0]._id)] | order(_createdAt desc) [$start...$end]{
    title,
    slug,
    excerpt,
    image{
      ${imageQuery}
    },
    categories[]->{
      title,
      slug
    },
  },
  "total": count(*[_type == "project" && defined(slug) && references(*[_type == "category" && slug.current == $slug][0]._id)]),
  "firstProjectImage": *[_type == "project" && defined(slug) && references(*[_type == "category" && slug.current == $slug][0]._id)] | order(_createdAt desc) [0].image{
    ${imageQuery}
  }
}`;

export const CATEGORIES_SLUGS_QUERY = groq`*[_type == "category" && defined(slug)]{slug}`;
