import { defineType, defineArrayMember } from 'sanity';
import { SquarePlay } from 'lucide-react';
import { YouTubePreview } from '@/sanity/schemas/previews/youtube-preview';
import { altTextField } from './alt-text-field';

export default defineType({
  title: 'Block Content',
  name: 'block-content',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'isExternal',
                type: 'boolean',
                title: 'Is External',
                initialValue: false,
              },
              {
                name: 'internalLink',
                type: 'reference',
                title: 'Internal Link',
                to: [{ type: 'page' }, { type: 'post' }],
                hidden: ({ parent }) => parent?.isExternal,
              },
              {
                name: 'href',
                title: 'href',
                type: 'url',
                hidden: ({ parent }) => !parent?.isExternal,
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'target',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
                hidden: ({ parent }) => !parent?.isExternal,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [altTextField],
    }),
    defineArrayMember({
      name: 'youtube',
      type: 'object',
      title: 'YouTube',
      icon: SquarePlay,
      fields: [
        {
          name: 'url',
          title: 'YouTube URL',
          type: 'url',
          description:
            'Full YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)',
          validation: (Rule) =>
            Rule.custom((url) => {
              if (!url) return true;
              const urlString = url.toString();
              // Match youtube.com or youtu.be URLs
              const youtubeRegex =
                /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
              if (youtubeRegex.test(urlString)) {
                return true;
              }
              return 'Please enter a valid YouTube URL';
            }).required(),
        },
      ],
      preview: {
        select: {
          url: 'url',
        },
        prepare({ url }) {
          // Extract video ID from URL for preview
          if (!url) return { title: 'YouTube Video' };
          const videoId = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          )?.[1];
          return {
            title: videoId || url,
            videoId: videoId,
          };
        },
      },
      components: {
        preview: YouTubePreview,
      },
    }),
    defineArrayMember({
      name: 'code',
      type: 'code',
      options: {
        withFilename: true,
        language: 'typescript',
        languageAlternatives: [
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'JSX', value: 'jsx' },
          { title: 'TSX', value: 'tsx' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'JSON', value: 'json' },
          { title: 'Python', value: 'python' },
          { title: 'PHP', value: 'php' },
          { title: 'Ruby', value: 'ruby' },
          { title: 'Shell', value: 'shell' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'YAML', value: 'yaml' },
          { title: 'GraphQL', value: 'graphql' },
          { title: 'SQL', value: 'sql' },
        ],
      },
    }),
  ],
});
