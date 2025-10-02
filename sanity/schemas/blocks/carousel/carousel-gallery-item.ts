import { defineField, defineType } from 'sanity';
import { ImageIcon } from 'lucide-react';
import { altTextField } from '../shared/alt-text-field';

export default defineType({
  name: 'carousel-gallery-item',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Title is required for carousel gallery items'),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      validation: (rule) =>
        rule.warning().max(200).error('Keep summary under 200 characters'),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [altTextField],
      validation: (rule) =>
        rule.required().error('Image is required for carousel gallery items'),
    }),
    defineField({
      name: 'link',
      type: 'link',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: 'Gallery Item',
        subtitle: title || 'No title',
        media,
      };
    },
  },
});
