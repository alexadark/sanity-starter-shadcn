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
      name: 'header',
      title: 'Header',
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
      name: 'postsPerPage',
      type: 'number',
      title: 'Posts Per Page',
      group: 'general',
      description: 'Number of posts to display per page on the blog listing',
      initialValue: 10,
      validation: (Rule) =>
        Rule.required().min(1).max(50).error('Must be between 1 and 50'),
    }),
    defineField({
      name: 'menuPosition',
      type: 'string',
      title: 'Menu Position',
      group: 'header',
      description: 'Position of the navigation menu in the header',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'headerButtons',
      type: 'array',
      title: 'Header Buttons',
      group: 'header',
      description: 'Buttons to display on the right side of the header',
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
                { type: 'blog-page' },
                { type: 'category' },
              ],
              hidden: ({ parent }) => parent?.isExternal,
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Button title is required'),
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
              title: 'Button Style',
              initialValue: 'default',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              variant: 'buttonVariant',
            },
            prepare({ title, variant }) {
              return {
                title: title || 'Untitled button',
                subtitle: variant || 'default',
              };
            },
          },
        },
      ],
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
