import { defineField, defineType } from 'sanity';
import { GalleryHorizontal } from 'lucide-react';

export default defineType({
  name: 'carousel-gallery',
  title: 'Carousel Gallery',
  type: 'object',
  icon: GalleryHorizontal,
  description: 'A horizontal scrolling gallery with cards',
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Heading is required for the gallery'),
    }),
    defineField({
      name: 'demoUrl',
      type: 'url',
      title: 'Demo URL',
      description: "URL for the 'Book a demo' link",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [{ type: 'carousel-gallery-item' }],
      validation: (rule) =>
        rule
          .min(1)
          .error('At least one gallery item is required')
          .max(10)
          .warning(
            'Consider limiting gallery items to 10 for better performance'
          ),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      itemCount: 'items.length',
    },
    prepare({ title, itemCount }) {
      return {
        title: 'Carousel Gallery',
        subtitle: `${title} (${itemCount || 0} items)`,
      };
    },
  },
});
