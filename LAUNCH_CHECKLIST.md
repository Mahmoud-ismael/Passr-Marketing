# Passr Landing — Launch Checklist

## Validation
- [ ] All pages render without errors (`npm run build` passes)
- [ ] Cookie consent banner appears on first visit
- [ ] Waitlist form submits successfully (Verify in Supabase dashboard)
- [ ] Resend sends confirmation email (Check Resend logs)
- [ ] All legal pages are linked from footer and readable
- [ ] Sitemap generates correctly at `/sitemap-index.xml`
- [ ] `robots.txt` is accessible at `/robots.txt`

## Performance & SEO
- [ ] Lighthouse scores: all >= 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Mobile responsiveness verified on iOS/Android
- [ ] Favicon visible in browser tabs
- [ ] Open Graph images render correctly on social sharing debuggers

## Security
- [ ] All HTTP security headers present (Verify with [securityheaders.com](https://securityheaders.com))
- [ ] HTTPS enforced (HSTS header active)
- [ ] Content Security Policy (CSP) not blocking legitimate scripts

## Regulatory & Legal
- [ ] Privacy Policy content reviewed for accuracy
- [ ] Terms of Service reviewed and Self-Attestation disclaimer visible
- [ ] DPA available and signature process tested

## Operations
- [ ] Google Search Console property verified
- [ ] Plausible analytics verified receiving data
- [ ] Domain email (hello@passr.eu) configured and receiving
- [ ] SPF/DKIM/DMARC DNS records configured for Resend
- [ ] Vercel production environment variables set:
  - `RESEND_API_KEY`
  - `WAITLIST_FROM_EMAIL`
  - `PUBLIC_PLAUSIBLE_DOMAIN`
