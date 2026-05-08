import { Resend } from 'resend';

const AUDIENCE_ID = '09709375-1a04-4d34-ac6f-1d774df85bd3';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const apiKey = process.env.PASSR_MARKETING;
  if (!apiKey) {
    return res.status(500).send('Server error.');
  }

  const resend = new Resend(apiKey);

  try {
    // In a real app, we would search for the contact ID first
    // But since Resend Audience API is simplified, we'll attempt to remove or update
    // For now, we'll use the remove API to ensure they stop getting emails
    await resend.contacts.remove({
      email,
      audienceId: AUDIENCE_ID,
    });

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed — Passr</title>
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #F4F4F4; }
          .card { background: white; padding: 40px; border-radius: 0px; border: 1px solid #DDD; text-align: center; max-width: 400px; }
          h1 { font-size: 20px; color: #0A0A0A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
          p { color: #666; line-height: 1.5; font-size: 14px; }
          .logo { margin-bottom: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">
             <img src="https://passr.eu/brand-assets/passr-logo-optimized.webp" alt="Passr" width="80" />
          </div>
          <h1>Unsubscribed</h1>
          <p>Your email <strong>${email}</strong> has been removed from our early access list. You will no longer receive updates from Passr.</p>
          <p style="margin-top: 24px;"><a href="https://passr.eu" style="color: #FF3B30; text-decoration: none; font-weight: 600;">← Back to Passr</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Unsubscribe Error:', error);
    return res.status(500).send('There was an error processing your request. Please email legal@passr.eu');
  }
}
