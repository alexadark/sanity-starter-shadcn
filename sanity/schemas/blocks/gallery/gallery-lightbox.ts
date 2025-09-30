import { defineField, defineType } from 'sanity';
import { ImageIcon } from 'lucide-react';
import { COLS_VARIANTS } from '../shared/layout-variants';

export default defineType({
  name: 'gallery-lightbox',
  title: 'Gallery Lightbox',
  type: 'object',
  icon: ImageIcon,
  description: 'A responsive image gallery with lightbox carousel',
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
      name: 'title',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Title is required for the gallery'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Optional description for the gallery',
    }),
    defineField({
      name: 'columns',
      type: 'string',
      title: 'Number of Columns',
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'grid-cols-3',
    }),
    defineField({
      name: 'spacing',
      type: 'string',
      title: 'Spacing Between Images',
      options: {
        list: [
          { title: 'Small', value: 'gap-2' },
          { title: 'Medium', value: 'gap-4' },
          { title: 'Large', value: 'gap-6' },
          { title: 'Extra Large', value: 'gap-8' },
        ],
        layout: 'radio',
      },
      initialValue: 'gap-4',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO and accessibility',
              validation: (rule) =>
                rule.required().error('Alt text is required for accessibility'),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption to display in the lightbox',
            }),
          ],
        },
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error('At least one image is required')
          .max(50)
          .warning('Consider limiting images to 50 for better performance'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      imageCount: 'images.length',
      columns: 'columns',
    },
    prepare({ title, imageCount, columns }) {
      const colsNum = columns?.replace('grid-cols-', '') || '3';
      return {
        title: 'Gallery Lightbox',
        subtitle: `${title} (${imageCount || 0} images, ${colsNum} columns)`,
      };
    },
  },
});
