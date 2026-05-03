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

  const { email } = req.body || {};

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
  const { data, error: contactError } = await resend.contacts.create({
    email,
    audienceId: AUDIENCE_ID,
  });

  if (contactError) {
    console.error('Resend Contact Error:', contactError);
    // If already subscribed, still send back success
    if (contactError.name !== 'validation_error') {
      return res.status(400).json({ error: `Audience Error: ${contactError.message}` });
    }
  }

  // 2. Send confirmation email
  const fromEmail = process.env.WAITLIST_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = `Passr <${fromEmail}>`;
  const { error: emailError } = await resend.emails.send({
    from: fromName,
    to: email,
    subject: 'Welcome to the Passr Protocol (Beta Access Confirmed)',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
        <h1 style="font-size: 24px; font-weight: bold; color: #FF3B30; text-transform: uppercase; letter-spacing: -0.02em;">
          Welcome to the Passr Protocol.
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          You're officially on the waitlist for the first industrial-grade Digital Product Passport platform built for outdoor brands.
        </p>
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
        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">
          Passr — Hisako Technologies OÜ // Tallinn, Estonia
        </p>
      </div>
    `,
  });

  if (emailError) {
    console.error('Resend Email Error:', emailError);
    // Don't fail the whole request if just the email fails
  }

  return res.status(200).json({ success: true });
}
