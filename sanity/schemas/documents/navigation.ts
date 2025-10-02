import { defineField, defineType } from 'sanity';
import { Menu } from 'lucide-react';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: Menu,
  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'isExternal',
              type: 'boolean',
              title: 'Is External',
              initialValue: false,
            }),
            defineField({
              name: 'internalLink',
              type: 'reference',
              title: 'Internal Link',
              to: [
                { type: 'page' },
                { type: 'post' },
                { type: 'project' },
                { type: 'projects-page' },
                { type: 'category' },
              ],
              hidden: ({ parent }) => parent?.isExternal,
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Link title is required'),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              hidden: ({ parent }) => !parent?.isExternal,
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
            defineField({
              name: 'target',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
              hidden: ({ parent }) => !parent?.isExternal,
            }),
            defineField({
              name: 'buttonVariant',
              type: 'button-variant',
              title: 'Link Style',
              initialValue: 'ghost',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              variant: 'buttonVariant',
            },
            prepare({ title, variant }) {
              return {
                title: title || 'Untitled link',
                subtitle: variant || 'ghost',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' };
    },
  },
});
