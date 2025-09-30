import { groq } from 'next-sanity';
import { imageQuery } from '../shared/image';

// @sanity-typegen-ignore
export const galleryLightboxQuery = groq`
  _type == "gallery-lightbox" => {
    _type,
    _key,
    padding,
    colorVariant,
    tagLine,
    title,
    description,
    columns,
    spacing,
    images[]{
      ${imageQuery},
      caption,
    },
  }
`;
