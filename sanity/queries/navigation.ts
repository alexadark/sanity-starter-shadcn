import { groq } from 'next-sanity';
import { linkQuery } from './shared/link';

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation"]{
    _type,
    _key,
    links[]{
      _key,
      _type,
      title,
      hasSubmenu,
      buttonVariant,
      target,
      ${linkQuery},
      subItems[]{
        _key,
        title,
        description,
        icon,
        isExternal,
        target,
        ${linkQuery}
      }
    }
  }
`;
