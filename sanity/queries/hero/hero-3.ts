import { groq } from 'next-sanity';
import { imageQuery } from '../shared/image';
import { linkQuery } from '../shared/link';

// @sanity-typegen-ignore
export const hero3Query = groq`
  _type == "hero-3" => {
    _type,
    _key,
    backgroundImage{
      ${imageQuery}
    },
    title,
    description,
    links[]{
      ${linkQuery}
    },
  }
`;
