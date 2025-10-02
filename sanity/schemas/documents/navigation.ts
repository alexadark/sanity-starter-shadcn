import { defineArrayMember, defineField, defineType } from 'sanity';
import { Menu } from 'lucide-react';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: Menu,
  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Menu item title is required'),
            }),
            defineField({
              name: 'hasSubmenu',
              type: 'boolean',
              title: 'Has Submenu',
              description:
                'Enable this to create a dropdown menu with subitems',
              initialValue: false,
            }),
            // Link fields for the menu item itself
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
              description:
                'Link for this menu item (works with or without submenu)',
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
              name: 'href',
              title: 'URL',
              type: 'url',
              description:
                'Link for this menu item (works with or without submenu)',
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
            // Submenu items
            defineField({
              name: 'subItems',
              title: 'Submenu Items',
              type: 'array',
              hidden: ({ parent }) => !parent?.hasSubmenu,
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'subMenuItem',
                  title: 'Submenu Item',
                  fields: [
                    defineField({
                      name: 'title',
                      type: 'string',
                      validation: (Rule) =>
                        Rule.required().error('Submenu item title is required'),
                    }),
                    defineField({
                      name: 'description',
                      type: 'text',
                      rows: 2,
                      description:
                        'Brief description shown in the dropdown menu',
                    }),
                    defineField({
                      name: 'icon',
                      type: 'string',
                      title: 'Icon Name',
                      description:
                        'Lucide icon name (e.g., "Book", "Zap", "Trees"). See https://lucide.dev',
                      validation: (Rule) =>
                        Rule.custom((value) => {
                          if (value && !/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                            return 'Icon name must be in PascalCase (e.g., "Book", "BookOpen")';
                          }
                          return true;
                        }),
                    }),
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
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      description: 'description',
                      icon: 'icon',
                    },
                    prepare({ title, description, icon }) {
                      return {
                        title: title || 'Untitled submenu item',
                        subtitle: description || icon || 'No description',
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              hasSubmenu: 'hasSubmenu',
              subItemsCount: 'subItems.length',
            },
            prepare({ title, hasSubmenu, subItemsCount }) {
              return {
                title: title || 'Untitled menu item',
                subtitle: hasSubmenu
                  ? `Dropdown with ${subItemsCount || 0} items`
                  : 'Simple link',
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' };
    },
  },
});
