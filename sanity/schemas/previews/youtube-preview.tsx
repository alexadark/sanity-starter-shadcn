import type { PreviewProps } from 'sanity';
import { Flex, Text } from '@sanity/ui';
import ReactPlayer from 'react-player';
import { SquarePlay } from 'lucide-react';

export function YouTubePreview(props: PreviewProps) {
  const { title, videoId } = props;

  // Use videoId from prepare function if available, otherwise try to extract from title
  const id = videoId || title;

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof id === 'string' && id ? (
        <ReactPlayer src={`https://www.youtube.com/watch?v=${id}`} />
      ) : (
        <Flex align="center" justify="center">
          <SquarePlay />
          <Text>Add a YouTube URL</Text>
        </Flex>
      )}
    </Flex>
  );
}
