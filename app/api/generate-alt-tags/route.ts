import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ImageToProcess {
  _id: string;
  imageUrl: string;
  fieldPath: string;
  documentTitle: string;
}

interface ProcessResult {
  _id: string;
  success: boolean;
  altText?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { images } = (await request.json()) as { images: ImageToProcess[] };

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const results: ProcessResult[] = [];

    // Process images in parallel with a concurrency limit
    const BATCH_SIZE = 5;
    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (image) => {
          try {
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: 'Generate a concise, descriptive alt text for this image. The alt text should be suitable for accessibility purposes and should describe the main subject and context of the image in 1-2 sentences. Do not include phrases like "image of" or "picture of". Just describe what you see.',
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: image.imageUrl,
                        detail: 'low',
                      },
                    },
                  ],
                },
              ],
              max_tokens: 100,
            });

            const altText = completion.choices[0]?.message?.content?.trim();

            if (altText) {
              return {
                _id: image._id,
                success: true,
                altText,
              };
            } else {
              return {
                _id: image._id,
                success: false,
                error: 'No alt text generated',
              };
            }
          } catch (error) {
            console.error(`Error processing image ${image._id}:`, error);
            return {
              _id: image._id,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        })
      );

      results.push(...batchResults);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in generate-alt-tags API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
