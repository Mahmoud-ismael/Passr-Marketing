import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
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

    // Supabase client initialization
    const supabase = createClient(
      import.meta.env.SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Resend client initialization
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // 1. Check if email already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEntry) {
      return new Response(JSON.stringify({ error: 'You are already on the waitlist.' }), { status: 400 });
    }

    // 2. Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ email });

    if (insertError) {
      console.error('Supabase Error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to join waitlist. Please try again.' }), { status: 500 });
    }

    // 3. Send confirmation email
    try {
      await resend.emails.send({
        from: import.meta.env.WAITLIST_FROM_EMAIL || 'hello@passr.eu',
        to: email,
        subject: "You're on the Passr waitlist.",
        text: "We'll be in touch when your access is ready. — The Passr Team",
      });
    } catch (emailError) {
      console.error('Resend Error:', emailError);
      // We don't return 500 here because the user is already in the DB
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
};
