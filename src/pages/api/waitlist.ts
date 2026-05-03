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
      await resend.contacts.create({
        email: email,
        audienceId: AUDIENCE_ID,
      });
    } catch (contactError: any) {
      // If the error is that they are already in the list, we can still say success
      // or handle it specifically. Resend returns 422 if already exists.
      console.error('Resend Contact Error:', contactError);
      if (contactError?.statusCode !== 422) {
        return new Response(JSON.stringify({ error: 'Failed to join waitlist. Please try again.' }), { status: 500 });
      }
    }

    // 2. Send confirmation email
    try {
      await resend.emails.send({
        from: import.meta.env.WAITLIST_FROM_EMAIL || 'hello@notify.passr.eu',
        to: email,
        subject: "Welcome to the Passr Protocol (Beta Access Confirmed)",
        html: `
          <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
            <h1 style="font-size: 24px; font-weight: bold; color: #FF3B30; text-transform: uppercase; letter-spacing: -0.02em;">Welcome to the Passr Protocol.</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">You're officially on the waitlist for the first industrial-grade Digital Product Passport platform built for outdoor brands.</p>
            
            <div style="background: #F5F5F5; padding: 24px; border-left: 4px solid #FF3B30; margin: 32px 0;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Beta Access Status: ACTIVE</h2>
              <p style="font-size: 14px; margin-bottom: 0;">As an early adopter, you've been granted priority access to our upcoming release:</p>
              <ul style="font-size: 14px; padding-left: 20px;">
                <li><strong>Exclusive Previews:</strong> Test our GS1 Digital Link generator before public release.</li>
                <li><strong>Compliance Priority:</strong> Early access to the PFAS Compliance Locker and material traceability tools.</li>
                <li><strong>Brand Featuring:</strong> We are selecting the first 100 brands to be featured as early adopters of the Passr protocol.</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #666;">We'll be in touch shortly with your unique access credentials.</p>
            <p style="font-size: 14px; font-weight: bold; margin-top: 32px;">— The Passr Team</p>
            <hr style="border: none; border-top: 1px solid #EEE; margin: 32px 0;" />
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Passr Secured Compliance Protocol // Berlin, Germany</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Resend Email Error:', emailError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
};
