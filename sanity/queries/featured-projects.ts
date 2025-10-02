import { groq } from 'next-sanity';
import { imageQuery } from './shared/image';

// @sanity-typegen-ignore
export const featuredProjectsQuery = groq`
  _type == "featured-projects" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    showViewAllButton,
    viewAllButtonText,
    viewAllButtonVariant,
    projects[]->{
      title,
      slug,
      excerpt,
      image{
        ${imageQuery}
      },
      categories[]->{
        title,
        slug
      },
    },
  }
`;
