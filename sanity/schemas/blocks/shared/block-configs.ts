// Shared block configurations for different content types

// All available blocks
export const ALL_BLOCKS = [
  { type: 'hero-1' },
  { type: 'hero-2' },
  { type: 'hero-3' },
  { type: 'section-header' },
  { type: 'split-row' },
  { type: 'grid-row' },
  { type: 'carousel-1' },
  { type: 'carousel-2' },
  { type: 'carousel-gallery' },
  { type: 'timeline-row' },
  { type: 'cta-1' },
  { type: 'logo-cloud-1' },
  { type: 'faqs' },
  { type: 'form-newsletter' },
  { type: 'all-posts' },
  { type: 'gallery-lightbox' },
  { type: 'features-cards' },
  { type: 'team-1' },
];

// Content blocks (without all-posts)
export const CONTENT_BLOCKS = ALL_BLOCKS.filter(
  (block) => block.type !== 'all-posts'
);

// Marketing-focused blocks
export const MARKETING_BLOCKS = [
  { type: 'hero-1' },
  { type: 'hero-2' },
  { type: 'hero-3' },
  { type: 'section-header' },
  { type: 'split-row' },
  { type: 'grid-row' },
  { type: 'cta-1' },
  { type: 'logo-cloud-1' },
  { type: 'faqs' },
  { type: 'form-newsletter' },
];

// Portfolio/showcase blocks
export const SHOWCASE_BLOCKS = [
  { type: 'hero-1' },
  { type: 'hero-3' },
  { type: 'section-header' },
  { type: 'split-row' },
  { type: 'grid-row' },
  { type: 'carousel-gallery' },
  { type: 'timeline-row' },
  { type: 'gallery-lightbox' },
];

// Insert menu groups configuration
export const BLOCK_MENU_GROUPS = [
  { name: 'hero', title: 'Hero', of: ['hero-1', 'hero-2', 'hero-3'] },
  { name: 'section-header', title: 'Section Header', of: ['section-header'] },
  { name: 'split', title: 'Split', of: ['split-row'] },
  { name: 'grid', title: 'Grid', of: ['grid-row'] },
  {
    name: 'carousel',
    title: 'Carousel',
    of: ['carousel-1', 'carousel-2', 'carousel-gallery'],
  },
  { name: 'timeline', title: 'Timeline', of: ['timeline-row'] },
  { name: 'logo-cloud', title: 'Logo Cloud', of: ['logo-cloud-1'] },
  { name: 'cta', title: 'CTA', of: ['cta-1'] },
  { name: 'faqs', title: 'FAQs', of: ['faqs'] },
  { name: 'forms', title: 'Forms', of: ['form-newsletter'] },
  { name: 'all-posts', title: 'All Posts', of: ['all-posts'] },
  { name: 'gallery', title: 'Gallery', of: ['gallery-lightbox'] },
  { name: 'features', title: 'Features', of: ['features-cards'] },
  { name: 'team', title: 'Team', of: ['team-1'] },
];

// Insert menu views
export const BLOCK_MENU_VIEWS = [
  {
    name: 'grid',
    previewImageUrl: (block: string) => `/sanity/preview/${block}.jpg`,
  },
  { name: 'list' },
];

// Helper to filter menu groups based on available blocks
export const getMenuGroups = (allowedBlocks: Array<{ type: string }>) => {
  const allowedTypes = allowedBlocks.map((b) => b.type);
  return BLOCK_MENU_GROUPS.filter((group) =>
    group.of.some((type) => allowedTypes.includes(type))
  ).map((group) => ({
    ...group,
    of: group.of.filter((type) => allowedTypes.includes(type)),
  }));
};

// Complete block field configuration helper
export const createBlocksField = (blocks: Array<{ type: string }>) => ({
  name: 'blocks',
  title: 'Content Blocks',
  type: 'array',
  of: blocks,
  options: {
    insertMenu: {
      groups: getMenuGroups(blocks),
      views: BLOCK_MENU_VIEWS,
    },
  },
});
