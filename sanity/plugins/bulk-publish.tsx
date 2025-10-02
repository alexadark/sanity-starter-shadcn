'use client';

import { definePlugin } from 'sanity';
import { CheckCheck } from 'lucide-react';
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

interface DraftDocument {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  _updatedAt: string;
}

function BulkPublishTool() {
  const client = useClient({ apiVersion: '2024-10-31' });
  const [drafts, setDrafts] = useState<DraftDocument[]>([]);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = `*[_id in path("drafts.**")] | order(_updatedAt desc) {
        _id,
        _type,
        title,
        name,
        _updatedAt
      }`;

      const results = await client.fetch(query);
      setDrafts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drafts');
      console.error('Error fetching drafts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const toggleDraft = (id: string) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrafts(newSelected);
  };

  const toggleAll = () => {
    if (selectedDrafts.size === drafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(drafts.map((d) => d._id)));
    }
  };

  const publishSelected = async () => {
    if (selectedDrafts.size === 0) return;

    setPublishing(true);
    setError(null);

    try {
      const transaction = client.transaction();

      for (const draftId of selectedDrafts) {
        const publishedId = draftId.replace('drafts.', '');
        const draft = drafts.find((d) => d._id === draftId);

        if (draft) {
          const fullDraft = await client.getDocument(draftId);
          if (fullDraft) {
            const publishedDoc = {
              ...fullDraft,
              _id: publishedId,
            };
            delete publishedDoc._rev;

            transaction.createOrReplace(publishedDoc);
            transaction.delete(draftId);
          }
        }
      }

      await transaction.commit();

      setSelectedDrafts(new Set());
      await fetchDrafts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to publish documents'
      );
      console.error('Error publishing:', err);
    } finally {
      setPublishing(false);
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
            Bulk Publish Documents
          </Text>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>
            Select and publish multiple draft documents at once
          </Text>
        </Box>

        {error && (
          <Card tone="critical" padding={3}>
            <Text>{error}</Text>
          </Card>
        )}

        {drafts.length === 0 ? (
          <Card padding={4} tone="transparent" border>
            <Text align="center" muted>
              No draft documents found
            </Text>
          </Card>
        ) : (
          <>
            <Flex gap={3}>
              <Button
                text={`${selectedDrafts.size === drafts.length ? 'Deselect' : 'Select'} All (${drafts.length})`}
                mode="ghost"
                onClick={toggleAll}
              />
              <Button
                text={`Publish Selected (${selectedDrafts.size})`}
                tone="positive"
                icon={CheckCheck}
                onClick={publishSelected}
                disabled={selectedDrafts.size === 0 || publishing}
                loading={publishing}
              />
              <Button
                text="Refresh"
                mode="ghost"
                onClick={fetchDrafts}
                disabled={publishing}
              />
            </Flex>

            <Stack space={2}>
              {drafts.map((draft) => (
                <Card
                  key={draft._id}
                  padding={3}
                  border
                  tone={selectedDrafts.has(draft._id) ? 'primary' : 'default'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleDraft(draft._id)}
                >
                  <Flex align="center" gap={3}>
                    <Checkbox
                      checked={selectedDrafts.has(draft._id)}
                      onChange={() => toggleDraft(draft._id)}
                    />
                    <Box flex={1}>
                      <Text weight="semibold">
                        {draft.title || draft.name || 'Untitled'}
                      </Text>
                      <Flex gap={2} style={{ marginTop: '0.25rem' }}>
                        <Text size={1} muted>
                          {draft._type}
                        </Text>
                        <Text size={1} muted>
                          •
                        </Text>
                        <Text size={1} muted>
                          Updated:{' '}
                          {new Date(draft._updatedAt).toLocaleDateString()}
                        </Text>
                      </Flex>
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

export const bulkPublishTool = definePlugin({
  name: 'bulk-publish-tool',
  tools: (prev) => [
    ...prev,
    {
      name: 'bulk-publish',
      title: 'Bulk Actions',
      icon: CheckCheck,
      component: BulkPublishTool,
    },
  ],
});
