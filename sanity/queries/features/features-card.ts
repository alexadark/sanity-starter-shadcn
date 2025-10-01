import { groq } from 'next-sanity';
import { linkQuery } from '../shared/link';
import { imageQuery } from '../shared/image';

// @sanity-typegen-ignore
export const featuresCardQuery = groq`
  _type == "features-card" => {
    _type,
    _key,
    mediaType,
    image{
      ${imageQuery}
    },
    icon,
    tagLine,
    title,
    description,
    links[]{
      ${linkQuery}
    },
  }
`;
