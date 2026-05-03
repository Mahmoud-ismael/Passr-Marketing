import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';

const waitlistSchema = z.object({
  email: z.string().email(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), { status: 400 });
    }

    const { email } = result.data;
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const AUDIENCE_ID = '09709375-1a04-4d34-ac6f-1d774df85bd3';

    // 1. Add to Resend Audience
    try {
      const { data, error } = await resend.contacts.create({
        email: email,
        audienceId: AUDIENCE_ID,
      });

      if (error) {
        console.error('Resend Audience Error:', error);
        // Resend returns error objects sometimes instead of throwing
        return new Response(JSON.stringify({ error: `Audience Error: ${error.message}` }), { status: 400 });
      }
    } catch (contactError: any) {
      console.error('Resend Contact Exception:', contactError);
      return new Response(JSON.stringify({ error: `System Error: ${contactError.message}` }), { status: 500 });
    }

    // 2. Send confirmation email
    try {
      const { error: emailError } = await resend.emails.send({
        from: import.meta.env.WAITLIST_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: "Welcome to the Passr Protocol (Beta Access Confirmed)",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
            <h1 style="color: #FF3B30;">Welcome to Passr.</h1>
            <p>Your beta access is confirmed.</p>
          </div>
        `
      });

      if (emailError) {
        console.error('Resend Email Error:', emailError);
        // We don't fail the whole request if just the email fails
      }
    } catch (sendError: any) {
      console.error('Resend Send Exception:', sendError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
};
