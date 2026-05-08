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

    const brandName = (typeof brand === 'string' ? brand.trim() : '') || 'Early Adopter';

    // Send via Resend
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const NOTIFY_EMAIL = import.meta.env.NOTIFY_EMAIL ?? 'momo178797@gmail.com';

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
        from: 'Passr Alerts <onboarding@resend.dev>',
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
        from: 'Passr <onboarding@resend.dev>',
        to: [email],
        subject: 'Access confirmed. Welcome to Passr.',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #0A0A0A;">
              
              <!-- Logo (High-Performance Stylized Text) -->
              <div style="margin-bottom: 32px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 800; color: #0A0A0A; letter-spacing: -0.02em; text-transform: uppercase;">
                      PASSR<span style="color: #FF3B30;">.</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Headline -->
              <h1 style="font-size: 28px; font-weight: 800; color: #FF3B30; text-transform: uppercase; letter-spacing: -0.02em; margin: 0 0 24px 0;">
                ACCESS CONFIRMED.
              </h1>

              <!-- Body Text -->
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 32px 0;">
                You're on the early access list for Passr — the Digital Product Passport infrastructure built for outdoor and activewear brands. EU ESPR compliant. GS1 certified. Live in days.
              </p>

              <!-- Callout Card -->
              <div style="background-color: #F8F8F8; border-left: 4px solid #FF3B30; padding: 32px; margin: 32px 0;">
                <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0A0A0A; margin: 0 0 20px 0;">
                  EARLY ACCESS STATUS: ACTIVE
                </h2>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; color: #0A0A0A;">
                      <strong>GS1 QR Generator</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; color: #585858; text-align: right;">
                      Test before public release
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; color: #0A0A0A;">
                      <strong>PFAS Compliance Locker</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; color: #585858; text-align: right;">
                      Priority access on launch
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-size: 14px; color: #0A0A0A;">
                      <strong>Early Adopter Status</strong>
                    </td>
                    <td style="padding: 12px 0; font-size: 14px; color: #585858; text-align: right;">
                      First 100 brands featured
                    </td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 32px 0 32px 0;">
                We'll be in touch before launch with your access details.
              </p>

              <p style="font-size: 15px; font-weight: 700; color: #0A0A0A; margin: 0;">
                The Passr Team
              </p>

              <!-- Footer -->
              <div style="margin-top: 60px; padding-top: 32px; border-top: 1px solid #F0F0F0; text-align: center;">
                <p style="font-family: Arial, sans-serif; font-size: 11px; color: #AAAAAA; line-height: 1.8; margin: 0;">
                  Passr — Hisako Technologies OÜ, Estonia<br />
                  You received this because you requested early access at <a href="https://passr.eu" style="color: #AAAAAA; text-decoration: underline;">passr.eu</a><br />
                  <a href="https://passr.eu/legal/privacy" style="color: #AAAAAA; text-decoration: underline;">Privacy Policy</a> | 
                  <a href="https://passr.eu/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #AAAAAA; text-decoration: underline;">Unsubscribe</a>
                </p>
              </div>

            </div>
          </body>
          </html>
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
