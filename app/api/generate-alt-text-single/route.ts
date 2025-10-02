import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = (await request.json()) as { imageUrl: string };

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

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
                url: imageUrl,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 100,
    });

    const altText = completion.choices[0]?.message?.content?.trim();

    if (!altText) {
      return NextResponse.json(
        { error: 'No alt text generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ altText });
  } catch (error) {
    console.error('Error in generate-alt-text-single API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
