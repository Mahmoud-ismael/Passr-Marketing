import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { brand, email } = body ?? {};

    // Basic validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'A valid email address is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const brandName = (typeof brand === 'string' ? brand.trim() : '') || 'Unknown Brand';

    // Send via Resend
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const NOTIFY_EMAIL   = import.meta.env.NOTIFY_EMAIL ?? 'momo178797@gmail.com';

    if (!RESEND_API_KEY) {
      console.error('[waitlist] RESEND_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Notify internal team
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Passr Waitlist <noreply@passr.eu>',
        to: [NOTIFY_EMAIL],
        subject: `[Waitlist] New signup: ${brandName}`,
        html: `
          <p><strong>Brand:</strong> ${brandName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><em>Submitted via passr.eu waitlist form</em></p>
        `,
      }),
    });

    // 2. Confirmation to the applicant
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Passr <noreply@passr.eu>',
        to: [email],
        subject: 'Passr Early Access — Request Received',
        html: `
          <p>Hi ${brandName},</p>
          <p>We've received your early access request for Passr.</p>
          <p>We'll be in touch shortly with next steps.</p>
          <p>— The Passr Team</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[waitlist] Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
