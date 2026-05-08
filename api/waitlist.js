import { Resend } from 'resend';

const AUDIENCE_ID = '09709375-1a04-4d34-ac6f-1d774df85bd3';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://passr.eu');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, brand } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const apiKey = process.env.PASSR_MARKETING;
  if (!apiKey) {
    console.error('PASSR_MARKETING env var is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const resend = new Resend(apiKey);

  // 1. Add to Resend Audience
  const { error: contactError } = await resend.contacts.create({
    email,
    firstName: brand || '',
    audienceId: AUDIENCE_ID,
  });

  if (contactError) {
    console.error('Resend Contact Error:', contactError);
    // If already subscribed, still send back success
    if (contactError.name !== 'validation_error') {
      // Continue anyway, maybe they just want the email again
    }
  }

  // 2. Send confirmation email
  const fromEmail = process.env.WAITLIST_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = `Passr <${fromEmail}>`;
  
  const { error: emailError } = await resend.emails.send({
    from: fromName,
    to: email,
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
          
          <!-- Logo -->
          <div style="margin-bottom: 32px;">
            <img src="https://passr.eu/brand-assets/passr-logo-optimized.webp" alt="Passr" width="120" style="display: block; border: 0;" />
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
  });

  if (emailError) {
    console.error('Resend Email Error:', emailError);
  }

  return res.status(200).json({ success: true });
}
