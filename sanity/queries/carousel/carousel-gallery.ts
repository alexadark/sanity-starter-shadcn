import { groq } from 'next-sanity';
import { carouselGalleryItemQuery } from './carousel-gallery-item';

// @sanity-typegen-ignore
export const carouselGalleryQuery = groq`
  _type == "carousel-gallery" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    demoUrl,
    items[]{
      ${carouselGalleryItemQuery},
    },
  }
`;
