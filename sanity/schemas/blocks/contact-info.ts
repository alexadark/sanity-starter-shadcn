import { defineField, defineType } from 'sanity';
import { Phone } from 'lucide-react';

export default defineType({
  name: 'contact-info',
  type: 'object',
  title: 'Contact Info',
  description: 'Display contact information with icons',
  icon: Phone,
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
      name: 'tagLine',
      type: 'string',
      description: 'Small label above the title (e.g., "Connect")',
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'Main heading (e.g., "Contact us")',
    }),
    defineField({
      name: 'description',
      type: 'text',
      description: 'Brief description of how you can help',
      rows: 3,
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Address',
      description: 'Contact email address',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone Number',
      description: 'Contact phone number',
    }),
    defineField({
      name: 'officeAddress',
      type: 'text',
      title: 'Office Address',
      description: 'Physical office address',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      email: 'email',
    },
    prepare({ title, email }) {
      return {
        title: 'Contact Info',
        subtitle: title || email || 'No title',
      };
    },
  },
});
