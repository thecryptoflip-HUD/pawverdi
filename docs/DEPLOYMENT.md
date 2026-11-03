# Deployment

Nothing here deploys automatically, and nothing should be published until the checklist at the bottom is signed off.

## 1. Supabase project

1. Create a project at supabase.com (region closest to your audience — for a UK/US audience, `eu-west-2` or `us-east-1`).
2. Copy three values from **Settings → API**: Project URL, `anon` key, `service_role` key.
3. Apply the schema — either:

   ```bash
   npm i -g supabase
   supabase link --project-ref <ref>
   supabase db push            # runs supabase/migrations/0001_init.sql
   ```

   or paste `supabase/migrations/0001_init.sql` into the SQL editor and run it once.

4. Create your own user (**Authentication → Users → Add user**), then promote yourself:

   ```sql
   update profiles set role = 'admin' where id = '<your-auth-user-id>';
   ```

5. Create a public storage bucket `article-images` for hero images.

## 2. Hosting

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import it in Vercel; framework preset is detected as Next.js.
3. Add environment variables for **Production** and **Preview**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=https://pawverdi.com
   ```

   `SUPABASE_SERVICE_ROLE_KEY` must be marked as a **server** variable (no `NEXT_PUBLIC_` prefix).
4. Deploy. Build command `npm run build`, output is handled automatically.

### Any Node host / Docker

```bash
npm ci
npm run build
npm start            # binds 3000, behind nginx or Caddy
```

Put TLS in front of it (Caddy: two lines). The app sets its own security headers, but HSTS belongs on the proxy.

## 3. DNS

For a GitHub-Pages-style static host this used to be A records; for a Next.js app you point the apex at the host instead:

| Record | Name | Value |
| --- | --- | --- |
| A | `@` | the IP your host gives you (Vercel: `76.76.21.21`) |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove the old GitHub Pages A records for the apex, or the two will fight and the domain will serve whichever resolves first.

## 4. Post-deploy verification

```bash
BASE=https://pawverdi.com npm run verify
```

Expect `21/21 checks passed`. Then check by hand:

- [ ] `/api/health` reports `"mode":"live"` (not `demo`).
- [ ] Submitting the newsletter form stores a row in `newsletter_subscribers`.
- [ ] A seller application appears in `seller_applications` with `status='new'`.
- [ ] Publishing an article with `review_status='unreviewed'` is **rejected** by the database (test in SQL editor).
- [ ] Publishing a listing for an unverified seller is **rejected**.
- [ ] Lighthouse on `/`: performance ≥ 90 mobile, accessibility ≥ 95.
- [ ] `/sitemap.xml` lists every article; `/robots.txt` blocks `/admin`.
- [ ] A page loads with JavaScript disabled and the headline is still readable.

## 5. Pre-publication checklist (blocking)

This build is **not** ready for public launch until these are true:

- [ ] Real editorial content replaces the seed summaries (`articles.body`).
- [ ] A licensed veterinarian is contracted for clinical review; reviewer names recorded in `articles.reviewer_name`.
- [ ] Seller verification process has a named human owner and a documented evidence standard.
- [ ] Animal-sale legal review for every jurisdiction you intend to list in (UK: Animal Welfare (Licensing of Activities Involving Animals) Regulations 2018; US: state-level breeder licensing; plus local advertising rules).
- [ ] Privacy policy and terms of service drafted by someone qualified, referencing your actual data processor (Supabase) and lawful basis.
- [ ] Advertising terms include the refusal list and the non-removable sponsor label.
- [ ] Cookie/consent posture decided (this build sets no analytics cookies; adding any changes this).
- [ ] Logo, photography and film either licensed or generated for you — `public/brand/*` currently holds AI-generated assets made for this project.
