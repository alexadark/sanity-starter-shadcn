import { groq } from 'next-sanity';
import { imageQuery } from '../shared/image';
import { linkQuery } from '../shared/link';

// @sanity-typegen-ignore
export const carouselGalleryItemQuery = groq`
  _type == "carousel-gallery-item" => {
    _type,
    _key,
    title,
    summary,
    image{
      ${imageQuery}
    },
    link{
      ${linkQuery}
    },
  }
`;
