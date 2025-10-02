import { defineField, defineType } from 'sanity';
import { ImageIcon } from 'lucide-react';
import { COLS_VARIANTS } from '../shared/layout-variants';
import { altTextField } from '../shared/alt-text-field';

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
      name: 'tagLine',
      type: 'string',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
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
            accept: 'image/*',
          },
          fields: [
            altTextField,
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption to display in the lightbox',
            }),
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
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
