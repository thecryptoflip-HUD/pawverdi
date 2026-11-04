# Security

## 1. Threat model

Without a session an attacker can reach public pages, the four intake forms (newsletter, contact, seller application and advertising enquiry), and `/api/health`. Intake routes validate input; they never publish content. Admin content and database diagnostics require credentials. The login page accepts credentials with a generic failure message. Public health exposes only service liveness and time.

## 2. Authentication

Supabase Auth validates email and password and stores the session in cookies through the SSR client. Server components and route handlers validate the user with Auth and read their role from `public.profiles`; missing profiles default to reader. No public sign-up or password reset flow is provided. Administrators provision accounts. There is no middleware: public pages retain static rendering and CDN caching. Only the publishable key reaches the browser; privileged clients import `server-only`.

## 3. Roles

| Role | View admin UI | Edit content | Run diagnostics | Manage roles |
| --- | --- | --- | --- | --- |
| reader | No (access notice only) | No | No | No |
| editor | Yes | Yes | No | No |
| reviewer | Yes | Yes | No | No |
| admin | Yes | Yes | Yes | Yes |

These are authorization capabilities; dashboard editing controls remain disabled until editing workflows exist. Future handlers must enforce capabilities on the server. A diagnostics bearer token grants write probes only, not schema detail or administrative account privileges; its limited response includes intake counts and requested round-trip/purge results.

## 4. Provision the first administrator

Create the user manually in Supabase Authentication. After the profile trigger creates their row, run this in the privileged SQL editor using the user's actual UUID:

```sql
update public.profiles set role = 'admin' where id = '<uuid>';
```

This is a privileged action: verify the user's identity and UUID before granting administrator access. Disable public account sign-ups in the Supabase Auth dashboard as well.

## 5. Rotate DIAGNOSTICS_TOKEN

Generate 32 random bytes as hex in a secure local environment (for example, `openssl rand -hex 32`). Never paste the value in chat or logs. Set the replacement through the secure environment prompt:

```sh
vercel env add DIAGNOSTICS_TOKEN production --force
```

Redeploy so the new environment takes effect. Verify the new credential works and the old value returns 401 without an authenticated session. The token grants write probes only, not schema detail. Keep it in a secret manager and send it only in the Authorization bearer header.

## 6. CSP analysis and proposal

Current directives are `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob: https://*.supabase.co`, `font-src 'self' data:`, `connect-src 'self' https://*.supabase.co`, `media-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, and `upgrade-insecure-requests`.

The App Router emits inline bootstrap scripts on statically rendered pages. Removing `'unsafe-inline'` from script-src without a replacement breaks hydration. Allowing inline scripts weakens protection against injected script, even though external script origins are restricted. Preserve the current policy for static public pages.

Per-request nonces can replace unsafe-inline: generate a cryptographic nonce, propagate it to the rendered scripts and CSP, and use middleware or dynamic rendering to produce matching headers and HTML. This incurs request-time rendering and loses shared static CDN caching. Recommend this nonce path only for `/admin/*` once it becomes interactive; do not introduce global middleware. Another option is to hash bootstrap scripts at build time, with a deployment pipeline that captures every emitted inline script and keeps CSP hashes synchronized across routes and builds.

## 7. API guard rule

Every new `/api/admin/*` handler must call `requireUser()` and check `isAdmin` or `isStaff` for the operation. `/api/admin/whoami` is the authentication-only proof of guard and exposes only role and display name. Return generic 401/403 responses before reading protected data. The guard test lives in `scripts/verify.mjs`. Never return or log credentials, cookies, passwords or tokens.
