import { groq } from 'next-sanity';
import { bodyQuery } from './shared/body';

// @sanity-typegen-ignore
export const contentBlockQuery = groq`
  _type == "content-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionWidth,
    stackAlign,
    tagLine,
    title,
    content[]{
      ${bodyQuery}
    },
  }
`;
