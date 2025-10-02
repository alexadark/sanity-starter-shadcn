import { defineField, defineType } from 'sanity';
import { Settings } from 'lucide-react';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: Settings,
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  fields: [
    defineField({
      name: 'logo',
      type: 'object',
      group: 'general',
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
      group: 'general',
      description: 'The name of your site',
      validation: (Rule) => Rule.required().error('Site name is required'),
    }),
    defineField({
      name: 'projectsPerPage',
      type: 'number',
      title: 'Projects Per Page',
      group: 'general',
      description:
        'Number of projects to display per page on the projects listing',
      initialValue: 10,
      validation: (Rule) =>
        Rule.required().min(1).max(50).error('Must be between 1 and 50'),
    }),
    defineField({
      name: 'footerLinks',
      type: 'array',
      title: 'Footer Links',
      group: 'footer',
      description: 'Links to display in the footer center section',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      title: 'Social Media Links',
      group: 'footer',
      description: 'Social media links to display in the footer',
      of: [{ type: 'social-link' }],
    }),
    defineField({
      name: 'copyright',
      type: 'block-content',
      group: 'footer',
      description: 'The copyright text to display in the footer',
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
