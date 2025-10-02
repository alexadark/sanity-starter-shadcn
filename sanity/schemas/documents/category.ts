import { defineField, defineType } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';
import { BookA } from 'lucide-react';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: BookA,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().error('Slug is required for the category URL'),
    }),
    orderRankField({ type: 'category' }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title,
        subtitle: 'Category',
      };
    },
  },
});
