# Deployment

Nothing here deploys automatically, and nothing should be published until the checklist at the bottom is signed off.

## 1. Supabase project

1. Create a project at supabase.com (region closest to your audience — for a UK/US audience, `eu-west-2` or `us-east-1`).
2. Copy three values from **Settings → API**: Project URL, `anon` key, `service_role` key.
3. Apply all migrations in filename order to the intended staging project first. For example:

   ```bash
   npm i -g supabase
   supabase link --project-ref <ref>
   supabase db push            # applies pending migrations
   ```

   or execute every file in `supabase/migrations/` in filename order against a new staging database. Track which migrations have already run.

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
   NEXT_PUBLIC_SUPABASE_ANON_KEY=        # legacy anon JWT (eyJ…) or publishable key (sb_publishable_…)
   SUPABASE_SERVICE_ROLE_KEY=            # legacy service_role JWT (eyJ…)
   # or, instead of the line above:
   SUPABASE_SECRET_KEY=                  # new secret key (sb_secret_…)
   NEXT_PUBLIC_SITE_URL=https://pawverdi.com
   ```

   The privileged key must be a **server** variable (no `NEXT_PUBLIC_` prefix),. Keep it in the host’s secret store.
   `lib/supabase-admin.ts` accepts either name and resolves them in this order:
   `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SECRET_KEY` → `SUPABASE_SERVICE_KEY`.
   Both key generations map to the `service_role` Postgres role and bypass RLS, so no
   application code changes when you migrate from one to the other.
4. Deploy. Build command `npm run build`, output is handled automatically.

### Any Node host / Docker

```bash
npm ci
npm run build
npm start            # binds 3000, behind nginx or Caddy
```

Put TLS in front of it (Caddy: two lines). The app sets its own security headers, but HSTS belongs on the proxy.

## 3. Domain and release

GitHub and Vercel are the established production path. Keep preview and production configuration separate. Check the hosting dashboard for current domain ownership and DNS targets before proposing any domain change.

## 4. Verification

Run the local regression suite against an isolated build. The suite includes form submissions, so use a disposable test environment. Do not point it at the public website. For the local production build, run:

```bash
npm ci
npm run build
bash scripts/verify-production.sh
```

Review the build-specific [release handoff](RELEASE-HANDOFF.md), including staging persistence, authenticated review and affiliate checks. Use read-only availability and page checks to confirm a future production deployment. Only confirmed, published material belongs in the sitemap.
