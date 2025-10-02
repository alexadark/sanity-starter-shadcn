import { linkQuery } from './link';
import { imageQuery } from './image';

export const bodyQuery = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ${linkQuery}
    }
  },
  _type == "image" => {
    ${imageQuery}
  },
  _type == "youtube" => {
    _type,
    url
  }
`;
