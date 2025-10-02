import { defineField, defineType } from 'sanity';
import { FolderKanban } from 'lucide-react';

export default defineType({
  name: 'projects-page',
  title: 'Projects Page',
  type: 'document',
  icon: FolderKanban,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      group: 'content',
      initialValue: 'Our Projects',
      validation: (Rule) => Rule.required().error('Hero title is required'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'content',
      initialValue:
        'Explore our portfolio of innovative solutions and successful implementations',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Projects Page',
        subtitle: 'Projects Page Configuration',
        media,
      };
    },
  },
});
