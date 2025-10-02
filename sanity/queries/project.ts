import { groq } from 'next-sanity';
import { hero1Query } from './hero/hero-1';
import { sectionHeaderQuery } from './section-header';
import { splitRowQuery } from './split/split-row';
import { gridRowQuery } from './grid/grid-row';
import { carouselGalleryQuery } from './carousel/carousel-gallery';
import { timelineQuery } from './timeline';
import { galleryLightboxQuery } from './gallery/gallery-lightbox';
import { cta1Query } from './cta/cta-1';
import { imageQuery } from './shared/image';

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
    title,
    slug,
    excerpt,
    image{
      ${imageQuery}
    },
    blocks[]{
      ${hero1Query},
      ${sectionHeaderQuery},
      ${splitRowQuery},
      ${gridRowQuery},
      ${carouselGalleryQuery},
      ${timelineQuery},
      ${galleryLightboxQuery},
      ${cta1Query},
    },
    categories[]->{
      title,
      slug
    },
    _createdAt,
    _updatedAt,
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

export const PROJECTS_QUERY = groq`*[_type == "project" && defined(slug)] | order(_createdAt desc){
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
}`;

export const PROJECTS_PAGINATED_QUERY = groq`{
  "projects": *[_type == "project" && defined(slug)] | order(_createdAt desc) [$start...$end]{
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
  "total": count(*[_type == "project" && defined(slug)])
}`;

export const PROJECTS_SLUGS_QUERY = groq`*[_type == "project" && defined(slug)]{slug}`;
