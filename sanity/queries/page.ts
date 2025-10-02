import { groq } from 'next-sanity';
import { hero1Query } from './hero/hero-1';
import { hero2Query } from './hero/hero-2';
import { hero3Query } from './hero/hero-3';
import { sectionHeaderQuery } from './section-header';
import { splitRowQuery } from './split/split-row';
import { gridRowQuery } from './grid/grid-row';
import { carousel1Query } from './carousel/carousel-1';
import { carousel2Query } from './carousel/carousel-2';
import { carouselGalleryQuery } from './carousel/carousel-gallery';
import { timelineQuery } from './timeline';
import { cta1Query } from './cta/cta-1';
import { logoCloud1Query } from './logo-cloud/logo-cloud-1';
import { faqsQuery } from './faqs';
import { formNewsletterQuery } from './forms/newsletter';
import { allPostsQuery } from './all-posts';
import { featuredProjectsQuery } from './featured-projects';
import { galleryLightboxQuery } from './gallery/gallery-lightbox';
import { featuresCardsQuery } from './features/features-cards';
import { team1Query } from './team/team-1';
import { contentBlockQuery } from './content-block';

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${hero1Query},
      ${hero2Query},
      ${hero3Query},
      ${sectionHeaderQuery},
      ${splitRowQuery},
      ${gridRowQuery},
      ${carousel1Query},
      ${carousel2Query},
      ${carouselGalleryQuery},
      ${timelineQuery},
      ${cta1Query},
      ${logoCloud1Query},
      ${faqsQuery},
      ${formNewsletterQuery},
      ${allPostsQuery},
      ${featuredProjectsQuery},
      ${galleryLightboxQuery},
      ${featuresCardsQuery},
      ${team1Query},
      ${contentBlockQuery},
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
  }
`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
