import { defineField, defineType } from 'sanity';
import { Square } from 'lucide-react';
import { altTextField } from '../shared/alt-text-field';

export default defineType({
  name: 'features-card',
  type: 'object',
  icon: Square,
  fields: [
    defineField({
      name: 'mediaType',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Icon', value: 'icon' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [altTextField],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'icon',
      type: 'lucide-icon',
      hidden: ({ parent }) => parent?.mediaType !== 'icon',
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
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tagLine: 'tagLine',
      media: 'image',
      mediaType: 'mediaType',
      icon: 'icon',
    },
    prepare({ title, tagLine, media, mediaType, icon }) {
      const displayTitle = title || tagLine || 'No title';
      const iconName = icon || 'Icon';
      const mediaLabel = mediaType === 'icon' ? `🎨 ${iconName}` : '🖼️ Image';

      return {
        title: displayTitle,
        subtitle: mediaLabel,
        media: mediaType === 'image' ? media : undefined,
      };
    },
  },
});
