import { groq } from 'next-sanity';
import { linkQuery } from '../shared/link';
import { imageQuery } from '../shared/image';

// @sanity-typegen-ignore
export const timeline2Query = groq`
  _type == "timeline-2" => {
    _type,
    _key,
    padding,
    colorVariant,
    tagLine,
    title,
    description,
    headerLinks[]{
      ${linkQuery}
    },
    phases[]{
      _key,
      phaseNumber,
      title,
      subtitle,
      description,
      image{
        ${imageQuery}
      },
      links[]{
        ${linkQuery}
      },
    },
  }
`;
