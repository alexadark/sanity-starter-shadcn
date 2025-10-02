import { defineField, defineType } from 'sanity';
import { FileText } from 'lucide-react';
import { altTextField } from '../blocks/shared/alt-text-field';

export default defineType({
  name: 'blog-page',
  title: 'Blog Page',
  type: 'document',
  icon: FileText,
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
      initialValue: 'Our Blog',
      validation: (Rule) => Rule.required().error('Hero title is required'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'content',
      initialValue: 'Discover insights, updates, and stories from our team',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [altTextField],
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
        title: title || 'Blog Page',
        subtitle: 'Blog Page Configuration',
        media,
      };
    },
  },
});
