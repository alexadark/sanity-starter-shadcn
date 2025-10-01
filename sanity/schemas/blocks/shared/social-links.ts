import { defineField, defineType } from 'sanity';
import {
  Share2,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { ComponentType } from 'react';

export const SOCIAL_PLATFORMS = [
  { title: 'GitHub', value: 'github', icon: Github },
  { title: 'X (Twitter)', value: 'x', icon: Share2 },
  { title: 'LinkedIn', value: 'linkedin', icon: Linkedin },
  { title: 'Facebook', value: 'facebook', icon: Facebook },
  { title: 'Instagram', value: 'instagram', icon: Instagram },
  { title: 'YouTube', value: 'youtube', icon: Youtube },
  { title: 'TikTok', value: 'tiktok', icon: Share2 },
  { title: 'Discord', value: 'discord', icon: Share2 },
  { title: 'Twitch', value: 'twitch', icon: Share2 },
  { title: 'Dribbble', value: 'dribbble', icon: Share2 },
  { title: 'Behance', value: 'behance', icon: Share2 },
  { title: 'Medium', value: 'medium', icon: Share2 },
  { title: 'Dev.to', value: 'devto', icon: Share2 },
  { title: 'Stack Overflow', value: 'stackoverflow', icon: Share2 },
] as const;

export default defineType({
  name: 'social-link',
  title: 'Social Link',
  type: 'object',
  icon: Share2,
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: SOCIAL_PLATFORMS.map(({ title, value }) => ({ title, value })),
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
    },
    prepare({ platform, url }) {
      const platformData = SOCIAL_PLATFORMS.find((p) => p.value === platform);
      return {
        title: platformData?.title || platform,
        subtitle: url,
        media: platformData?.icon || Share2,
      };
    },
  },
});
