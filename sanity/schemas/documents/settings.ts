import { defineField, defineType } from 'sanity';
import { Settings } from 'lucide-react';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: Settings,
  fields: [
    defineField({
      name: 'logo',
      type: 'object',
      fields: [
        defineField({
          name: 'dark',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'light',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'width',
          type: 'number',
          title: 'Width',
          description:
            'The width of the logo. Default is dimensions of the image.',
        }),
        defineField({
          name: 'height',
          type: 'number',
          title: 'Height',
          description:
            'The height of the logo. Default is dimensions of the image.',
        }),
      ],
    }),
    defineField({
      name: 'siteName',
      type: 'string',
      description: 'The name of your site',
      validation: (Rule) => Rule.required().error('Site name is required'),
    }),
    defineField({
      name: 'copyright',
      type: 'block-content',
      description: 'The copyright text to display in the footer',
    }),
    defineField({
      name: 'projectsPerPage',
      type: 'number',
      title: 'Projects Per Page',
      description:
        'Number of projects to display per page on the projects listing',
      initialValue: 10,
      validation: (Rule) =>
        Rule.required().min(1).max(50).error('Must be between 1 and 50'),
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Site Settings',
        media,
      };
    },
  },
});
