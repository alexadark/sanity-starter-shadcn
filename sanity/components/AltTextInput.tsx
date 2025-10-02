'use client';

import { useState } from 'react';
import { StringInputProps, set, unset, useFormValue, useClient } from 'sanity';
import { TextInput, Stack, Button, Text, Card } from '@sanity/ui';
import { Sparkles } from 'lucide-react';

export function AltTextInput(props: StringInputProps) {
  const { value, onChange, elementProps, path } = props;
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the Sanity client
  const client = useClient({ apiVersion: '2024-10-31' });

  // Get the image object from the document using the path
  // The alt field path is like ['image', 'alt'], so we need to go up one level to get the image
  const imagePath = path.slice(0, -1); // Remove 'alt' from the path
  const imageValue = useFormValue(imagePath) as any;

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      console.log('Image value:', imageValue);
      console.log('Path:', path);

      const imageAsset = imageValue?.asset;
      console.log('Image asset:', imageAsset);

      if (!imageAsset) {
        setError('Please upload an image first');
        setGenerating(false);
        return;
      }

      // Handle both reference format and direct asset format
      const assetId = imageAsset._ref || imageAsset._id || imageAsset;
      console.log('Asset ID:', assetId);

      if (!assetId) {
        setError('Could not find image reference');
        setGenerating(false);
        return;
      }

      // Fetch the image asset details to get the URL
      const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
        id: assetId,
      });

      console.log('Fetched asset:', asset);

      if (!asset?.url) {
        setError('Could not load image URL');
        setGenerating(false);
        return;
      }

      // Call the API endpoint to generate alt text
      const response = await fetch('/api/generate-alt-text-single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: asset.url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate alt text');
      }

      const { altText } = await response.json();
      console.log('Generated alt text:', altText);

      if (altText) {
        onChange(set(altText));
      } else {
        setError('No alt text generated');
      }
    } catch (err) {
      console.error('Error generating alt text:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to generate alt text'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Stack space={2}>
      <Stack space={2}>
        <TextInput
          {...elementProps}
          value={value || ''}
          onChange={(event) =>
            onChange(
              event.currentTarget.value
                ? set(event.currentTarget.value)
                : unset()
            )
          }
        />
        <Button
          text={generating ? 'Generating...' : 'Generate with AI'}
          icon={Sparkles}
          mode="ghost"
          tone="primary"
          onClick={handleGenerate}
          disabled={generating}
          loading={generating}
          fontSize={1}
        />
      </Stack>
      {error && (
        <Card tone="critical" padding={2} radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  );
}
