import { groq } from 'next-sanity';
import { featuresCardQuery } from './features-card';

// @sanity-typegen-ignore
export const featuresCardsQuery = groq`
  _type == "features-cards" => {
    _type,
    _key,
    padding,
    colorVariant,
    tagLine,
    title,
    description,
    layout,
    cards[]{
      ${featuresCardQuery}
    },
  }
`;
