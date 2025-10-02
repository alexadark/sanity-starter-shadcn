import { defineField, defineType } from 'sanity';
import { FileText } from 'lucide-react';
import { STACK_ALIGN, SECTION_WIDTH } from './shared/layout-variants';

export default defineType({
  name: 'content-block',
  title: 'Content Block',
  type: 'object',
  description: 'Rich content block with heading and flexible content editor',
  icon: FileText,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'sectionWidth',
      type: 'string',
      title: 'Section Width',
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'narrow',
    }),
    defineField({
      name: 'stackAlign',
      type: 'string',
      title: 'Content Alignment',
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'tagLine',
      type: 'string',
      title: 'Tag Line',
      description: 'Optional tag line above the title',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Optional section title',
    }),
    defineField({
      name: 'content',
      type: 'block-content',
      title: 'Content',
      description:
        'Rich content editor supporting text, images, videos, and code',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tagLine: 'tagLine',
    },
    prepare({ title, tagLine }) {
      return {
        title: 'Content Block',
        subtitle: title || tagLine || 'No title',
      };
    },
  },
});
