import { type SchemaTypeDefinition } from 'sanity';
// documents
import page from './schemas/documents/page';
import post from './schemas/documents/post';
import project from './schemas/documents/project';
import projectsPage from './schemas/documents/projects-page';
import blogPage from './schemas/documents/blog-page';
import author from './schemas/documents/author';
import category from './schemas/documents/category';
import faq from './schemas/documents/faq';
import testimonial from './schemas/documents/testimonial';
import navigation from './schemas/documents/navigation';
import settings from './schemas/documents/settings';

// Schema UI shared objects
import blockContent from './schemas/blocks/shared/block-content';
import link from './schemas/blocks/shared/link';
import { colorVariant } from './schemas/blocks/shared/color-variant';
import { buttonVariant } from './schemas/blocks/shared/button-variant';
import sectionPadding from './schemas/blocks/shared/section-padding';
import socialLink from './schemas/blocks/shared/social-links';
// Schema UI objects
import hero1 from './schemas/blocks/hero/hero-1';
import hero2 from './schemas/blocks/hero/hero-2';
import hero3 from './schemas/blocks/hero/hero-3';
import sectionHeader from './schemas/blocks/section-header';
import splitRow from './schemas/blocks/split/split-row';
import splitContent from './schemas/blocks/split/split-content';
import splitCardsList from './schemas/blocks/split/split-cards-list';
import splitCard from './schemas/blocks/split/split-card';
import splitImage from './schemas/blocks/split/split-image';
import splitInfoList from './schemas/blocks/split/split-info-list';
import splitInfo from './schemas/blocks/split/split-info';
import gridCard from './schemas/blocks/grid/grid-card';
import pricingCard from './schemas/blocks/grid/pricing-card';
import gridPost from './schemas/blocks/grid/grid-post';
import gridRow from './schemas/blocks/grid/grid-row';
import carousel1 from './schemas/blocks/carousel/carousel-1';
import carousel2 from './schemas/blocks/carousel/carousel-2';
import carouselGallery from './schemas/blocks/carousel/carousel-gallery';
import carouselGalleryItem from './schemas/blocks/carousel/carousel-gallery-item';
import timelineRow from './schemas/blocks/timeline/timeline-row';
import timelinesOne from './schemas/blocks/timeline/timelines-1';
import timeline2 from './schemas/blocks/timeline/timeline-2';
import cta1 from './schemas/blocks/cta/cta-1';
import logoCloud1 from './schemas/blocks/logo-cloud/logo-cloud-1';
import faqs from './schemas/blocks/faqs';
import newsletter from './schemas/blocks/forms/newsletter';
import allPosts from './schemas/blocks/all-posts';
import featuredProjects from './schemas/blocks/featured-projects';
import galleryLightbox from './schemas/blocks/gallery/gallery-lightbox';
import featuresCards from './schemas/blocks/features/features-cards';
import featuresCard from './schemas/blocks/features/features-card';
import team1 from './schemas/blocks/team/team-1';
import contentBlock from './schemas/blocks/content-block';
import contactInfo from './schemas/blocks/contact-info';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    page,
    post,
    project,
    projectsPage,
    blogPage,
    author,
    category,
    faq,
    testimonial,
    navigation,
    settings,
    // shared objects
    blockContent,
    link,
    colorVariant,
    buttonVariant,
    sectionPadding,
    socialLink,
    // blocks
    hero1,
    hero2,
    hero3,
    sectionHeader,
    splitRow,
    splitContent,
    splitCardsList,
    splitCard,
    splitImage,
    splitInfoList,
    splitInfo,
    gridCard,
    pricingCard,
    gridPost,
    gridRow,
    carousel1,
    carousel2,
    carouselGallery,
    carouselGalleryItem,
    timelineRow,
    timelinesOne,
    timeline2,
    cta1,
    logoCloud1,
    faqs,
    newsletter,
    allPosts,
    featuredProjects,
    galleryLightbox,
    featuresCards,
    featuresCard,
    team1,
    contentBlock,
    contactInfo,
  ],
};
