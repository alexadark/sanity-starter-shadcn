import { Resend } from 'resend';

export const POST = async (request: Request) => {
  // Check if required environment variables are available
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return Response.json(
      { error: 'Newsletter service is not configured' },
      { status: 500 }
    );
  }

  if (!process.env.RESEND_AUDIENCE_ID) {
    console.error('RESEND_AUDIENCE_ID is not configured');
    return Response.json(
      { error: 'Newsletter audience is not configured' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email } = await request.json();

  // Create contact
  try {
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Resend error:', error);
    return Response.json(
      { error: 'Error subscribing to updates' },
      { status: 400 }
    );
  }
};
