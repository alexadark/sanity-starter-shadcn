'use client';

import { definePlugin } from 'sanity';
import { ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  Stack,
  Text,
  Button,
  Checkbox,
  Box,
  Flex,
  Spinner,
} from '@sanity/ui';
import { useClient } from 'sanity';

interface ImageDocument {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  imageUrl: string;
  documentTitle?: string;
  generatedAlt?: string;
}

function GenerateAltTagsTool() {
  const client = useClient({ apiVersion: '2024-10-31' });
  const [images, setImages] = useState<ImageDocument[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const fetchImagesWithoutAlt = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get ALL documents with ANY images
      const query = `*[defined(image) || defined(images) || defined(blocks)] {
        _id,
        _type,
        title,
        name,
        image,
        images,
        blocks
      }`;

      const results = await client.fetch(query);
      const imageDocuments: ImageDocument[] = [];
      const seenUrls = new Set<string>(); // Prevent duplicates

      for (const doc of results) {
        // 1. Check top-level image field
        if (doc.image?.asset?._ref && !doc.image.alt) {
          const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
            id: doc.image.asset._ref,
          });
          if (asset?.url && !seenUrls.has(asset.url)) {
            seenUrls.add(asset.url);
            imageDocuments.push({
              _id: doc._id,
              _type: doc._type,
              title: doc.title,
              name: doc.name,
              imageUrl: asset.url,
              documentTitle: `${doc.title || doc.name || 'Untitled'} (main image)`,
            });
          }
        }

        // 2. Check images array (for documents like gallery-lightbox)
        if (Array.isArray(doc.images)) {
          for (let i = 0; i < doc.images.length; i++) {
            const img = doc.images[i];
            if (img?.asset?._ref && !img.alt) {
              const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                id: img.asset._ref,
              });
              if (asset?.url && !seenUrls.has(`${doc._id}-${i}-${asset.url}`)) {
                seenUrls.add(`${doc._id}-${i}-${asset.url}`);
                imageDocuments.push({
                  _id: `${doc._id}-images-${i}`,
                  _type: doc._type,
                  title: doc.title,
                  name: doc.name,
                  imageUrl: asset.url,
                  documentTitle: `${doc.title || doc.name || 'Untitled'} (image ${i + 1})`,
                });
              }
            }
          }
        }

        // 3. Check blocks array
        if (Array.isArray(doc.blocks)) {
          for (const block of doc.blocks) {
            // Check if block has an image field
            if (block?.image?.asset?._ref && !block.image.alt) {
              const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                id: block.image.asset._ref,
              });
              if (
                asset?.url &&
                !seenUrls.has(`${doc._id}-${block._key}-${asset.url}`)
              ) {
                seenUrls.add(`${doc._id}-${block._key}-${asset.url}`);
                imageDocuments.push({
                  _id: `${doc._id}-block-${block._key}`,
                  _type: `${doc._type} (${block._type})`,
                  title: doc.title,
                  name: doc.name,
                  imageUrl: asset.url,
                  documentTitle: `${doc.title || doc.name || 'Untitled'} - ${block._type}`,
                });
              }
            }

            // Check if block has images array (like gallery-lightbox in blocks)
            if (Array.isArray(block?.images)) {
              for (let i = 0; i < block.images.length; i++) {
                const img = block.images[i];
                if (img?.asset?._ref && !img.alt) {
                  const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                    id: img.asset._ref,
                  });
                  if (
                    asset?.url &&
                    !seenUrls.has(`${doc._id}-${block._key}-${i}-${asset.url}`)
                  ) {
                    seenUrls.add(`${doc._id}-${block._key}-${i}-${asset.url}`);
                    imageDocuments.push({
                      _id: `${doc._id}-block-${block._key}-img-${i}`,
                      _type: `${doc._type} (${block._type})`,
                      title: doc.title,
                      name: doc.name,
                      imageUrl: asset.url,
                      documentTitle: `${doc.title || doc.name || 'Untitled'} - ${block.title || block._type} - Image ${i + 1}`,
                    });
                  }
                }
              }
            }

            // Check carousel gallery items
            if (Array.isArray(block?.items)) {
              for (let i = 0; i < block.items.length; i++) {
                const item = block.items[i];
                if (item?.image?.asset?._ref && !item.image.alt) {
                  const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                    id: item.image.asset._ref,
                  });
                  if (
                    asset?.url &&
                    !seenUrls.has(
                      `${doc._id}-${block._key}-item-${i}-${asset.url}`
                    )
                  ) {
                    seenUrls.add(
                      `${doc._id}-${block._key}-item-${i}-${asset.url}`
                    );
                    imageDocuments.push({
                      _id: `${doc._id}-block-${block._key}-item-${i}`,
                      _type: `${doc._type} (${block._type})`,
                      title: doc.title,
                      name: doc.name,
                      imageUrl: asset.url,
                      documentTitle: `${doc.title || doc.name || 'Untitled'} - ${item.title || 'Item'} ${i + 1}`,
                    });
                  }
                }
              }
            }

            // Check columns array (for grid-row, split-row, etc.)
            if (Array.isArray(block?.columns)) {
              for (let i = 0; i < block.columns.length; i++) {
                const col = block.columns[i];
                if (col?.image?.asset?._ref && !col.image.alt) {
                  const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                    id: col.image.asset._ref,
                  });
                  if (
                    asset?.url &&
                    !seenUrls.has(
                      `${doc._id}-${block._key}-col-${i}-${asset.url}`
                    )
                  ) {
                    seenUrls.add(
                      `${doc._id}-${block._key}-col-${i}-${asset.url}`
                    );
                    imageDocuments.push({
                      _id: `${doc._id}-block-${block._key}-col-${i}`,
                      _type: `${doc._type} (${block._type})`,
                      title: doc.title,
                      name: doc.name,
                      imageUrl: asset.url,
                      documentTitle: `${doc.title || doc.name || 'Untitled'} - ${block._type} - Column ${i + 1}`,
                    });
                  }
                }
              }
            }

            // Check splitColumns array
            if (Array.isArray(block?.splitColumns)) {
              for (let i = 0; i < block.splitColumns.length; i++) {
                const col = block.splitColumns[i];
                if (col?.image?.asset?._ref && !col.image.alt) {
                  const asset = await client.fetch(`*[_id == $id][0]{ url }`, {
                    id: col.image.asset._ref,
                  });
                  if (
                    asset?.url &&
                    !seenUrls.has(
                      `${doc._id}-${block._key}-splitcol-${i}-${asset.url}`
                    )
                  ) {
                    seenUrls.add(
                      `${doc._id}-${block._key}-splitcol-${i}-${asset.url}`
                    );
                    imageDocuments.push({
                      _id: `${doc._id}-block-${block._key}-splitcol-${i}`,
                      _type: `${doc._type} (${block._type})`,
                      title: doc.title,
                      name: doc.name,
                      imageUrl: asset.url,
                      documentTitle: `${doc.title || doc.name || 'Untitled'} - ${block._type} - Split ${i + 1}`,
                    });
                  }
                }
              }
            }
          }
        }
      }

      setImages(imageDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesWithoutAlt();
  }, []);

  const toggleImage = (id: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  const toggleAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img._id)));
    }
  };

  const generateAltTags = async () => {
    if (selectedImages.size === 0) return;

    setGenerating(true);
    setError(null);
    setSuccessCount(0);

    try {
      const selectedImageData = images.filter((img) =>
        selectedImages.has(img._id)
      );

      // Call the API endpoint to generate alt tags
      const response = await fetch('/api/generate-alt-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: selectedImageData.map((img) => ({
            _id: img._id,
            imageUrl: img.imageUrl,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate alt tags');
      }

      const { results } = await response.json();

      // Update images state with generated alt text for display
      setImages((prevImages) =>
        prevImages.map((img) => {
          const result = results.find((r: any) => r._id === img._id);
          if (result?.success && result.altText) {
            return { ...img, generatedAlt: result.altText };
          }
          return img;
        })
      );

      // Update documents with generated alt tags
      let successCount = 0;
      const savedDocIds = new Set<string>();

      for (const result of results) {
        if (result.success && result.altText) {
          try {
            const imageDoc = selectedImageData.find(
              (img) => img._id === result._id
            );

            if (!imageDoc) continue;

            // Handle simple document IDs (top-level images)
            if (
              !result._id.includes('-block-') &&
              !result._id.includes('-images-')
            ) {
              console.log(`Saving alt text for document: ${result._id}`);
              await client
                .patch(result._id)
                .set({ 'image.alt': result.altText })
                .commit();
              savedDocIds.add(result._id);
              successCount++;
              console.log(`✓ Saved alt text for ${result._id}`);
            } else {
              // For complex images in blocks/galleries
              console.log(
                `Skipping complex image: ${result._id} (use inline button)`
              );
              successCount++; // Count as "processed" but not saved
            }
          } catch (patchErr) {
            console.error(`Failed to update ${result._id}:`, patchErr);
          }
        }
      }

      console.log(`Total saved: ${savedDocIds.size} documents`);
      setSuccessCount(successCount);
      setSelectedImages(new Set());

      // Wait a bit before refreshing to allow Sanity to process
      setTimeout(() => {
        fetchImagesWithoutAlt();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate alt tags'
      );
      console.error('Error generating alt tags:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card padding={4}>
        <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
          <Spinner />
        </Flex>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Box>
          <Text size={3} weight="bold">
            Generate Alt Tags with AI
          </Text>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>
            This tool finds ALL images without alt text across your entire site.
            <br />
            <strong>Note:</strong> Images in galleries and blocks are shown here
            for reference, but use the "Generate with AI" button directly in the
            image editor for best results.
          </Text>
        </Box>

        {error && (
          <Card tone="critical" padding={3}>
            <Text>{error}</Text>
          </Card>
        )}

        {successCount > 0 && (
          <Card tone="positive" padding={3}>
            <Stack space={2}>
              <Text weight="bold">
                ✓ Successfully generated alt tags for {successCount} image
                {successCount !== 1 ? 's' : ''}!
              </Text>
              <Text size={1}>
                <strong>Important:</strong> To see the alt text in the image
                editor, you must:
              </Text>
              <Box paddingLeft={3}>
                <Text size={1}>
                  1. Refresh your browser (⌘+R or Ctrl+R)
                  <br />
                  2. Or close and reopen any documents you had open
                  <br />
                  3. The alt text has been saved to the database
                </Text>
              </Box>
            </Stack>
          </Card>
        )}

        {images.length === 0 ? (
          <Card padding={4} tone="transparent" border>
            <Text align="center" muted>
              No images without alt text found
            </Text>
          </Card>
        ) : (
          <>
            <Flex gap={3}>
              <Button
                text={`${selectedImages.size === images.length ? 'Deselect' : 'Select'} All (${images.length})`}
                mode="ghost"
                onClick={toggleAll}
              />
              <Button
                text={`Generate Alt Tags (${selectedImages.size})`}
                tone="positive"
                icon={ImageIcon}
                onClick={generateAltTags}
                disabled={selectedImages.size === 0 || generating}
                loading={generating}
              />
              <Button
                text="Refresh"
                mode="ghost"
                onClick={fetchImagesWithoutAlt}
                disabled={generating}
              />
            </Flex>

            <Stack space={2}>
              {images.map((image) => (
                <Card
                  key={image._id}
                  padding={3}
                  border
                  tone={
                    image.generatedAlt
                      ? 'positive'
                      : selectedImages.has(image._id)
                        ? 'primary'
                        : 'default'
                  }
                  style={{ cursor: image.generatedAlt ? 'default' : 'pointer' }}
                  onClick={() => !image.generatedAlt && toggleImage(image._id)}
                >
                  <Flex align="flex-start" gap={3}>
                    {!image.generatedAlt && (
                      <Checkbox
                        checked={selectedImages.has(image._id)}
                        onChange={() => toggleImage(image._id)}
                      />
                    )}
                    <Box
                      style={{
                        width: '80px',
                        height: '80px',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`${image.imageUrl}?w=160&h=160&fit=crop`}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box flex={1}>
                      <Text weight="semibold">{image.documentTitle}</Text>
                      <Flex gap={2} style={{ marginTop: '0.25rem' }}>
                        <Text size={1} muted>
                          {image._type}
                        </Text>
                      </Flex>
                      {image.generatedAlt && (
                        <Box
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'rgba(0, 128, 0, 0.1)',
                            borderRadius: '4px',
                          }}
                        >
                          <Text
                            size={1}
                            weight="semibold"
                            style={{ color: 'green' }}
                          >
                            ✓ Generated Alt Text:
                          </Text>
                          <Text size={1} style={{ marginTop: '0.25rem' }}>
                            {image.generatedAlt}
                          </Text>
                          <Text size={1} muted style={{ marginTop: '0.25rem' }}>
                            {!image._id.includes('-block-') &&
                            !image._id.includes('-images-')
                              ? '✓ Saved to database! Refresh browser (⌘+R) to see it in the image editor.'
                              : '⚠️ Gallery/block images: Copy this text and paste it using the "Generate with AI" button in the image editor.'}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}

export const generateAltTagsTool = definePlugin({
  name: 'generate-alt-tags-tool',
  tools: (prev) => [
    ...prev,
    {
      name: 'generate-alt-tags',
      title: 'Generate Alt Tags',
      icon: ImageIcon,
      component: GenerateAltTagsTool,
    },
  ],
});
