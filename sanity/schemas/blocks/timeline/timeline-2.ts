import { defineType, defineField, defineArrayMember } from 'sanity';
import { GitBranch } from 'lucide-react';

export default defineType({
  name: 'timeline-2',
  type: 'object',
  title: 'Timeline 2 - Alternating',
  description: 'Timeline with alternating image and content layout',
  icon: GitBranch,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
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
    }),
    defineField({
      name: 'headerLinks',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'phases',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phase',
          fields: [
            defineField({
              name: 'phaseNumber',
              type: 'string',
              title: 'Phase Number',
            }),
            defineField({
              name: 'title',
              type: 'string',
            }),
            defineField({
              name: 'subtitle',
              type: 'string',
            }),
            defineField({
              name: 'description',
              type: 'text',
            }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', type: 'string' })],
            }),
            defineField({
              name: 'links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
              validation: (rule) => rule.max(2),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              phaseNumber: 'phaseNumber',
              media: 'image',
            },
            prepare({ title, phaseNumber, media }) {
              return {
                title: phaseNumber
                  ? `${phaseNumber}: ${title || 'Untitled'}`
                  : title || 'Untitled',
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Timeline 2 - Alternating',
        subtitle: title || 'No Title',
      };
    },
  },
});
