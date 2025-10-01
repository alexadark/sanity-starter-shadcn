import { defineField, defineType, defineArrayMember } from 'sanity';
import { Users } from 'lucide-react';

export default defineType({
  name: 'team-1',
  title: 'Team 1',
  type: 'object',
  icon: Users,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
    }),
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamMember',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              type: 'string',
            }),
            defineField({
              name: 'avatar',
              type: 'image',
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
              name: 'socialLinks',
              type: 'array',
              title: 'Social Links',
              of: [{ type: 'social-link' }],
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'avatar',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      membersCount: 'members.length',
    },
    prepare({ title, membersCount }) {
      return {
        title: 'Team 1',
        subtitle: title || `${membersCount || 0} members`,
      };
    },
  },
});
