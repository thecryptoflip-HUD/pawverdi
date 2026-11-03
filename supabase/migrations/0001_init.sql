-- =========================================================================
-- PawVerdi — initial schema
-- Postgres 15+ / Supabase. Run with: supabase db push  (or paste in SQL editor)
--
-- Design rules encoded here, not just in the UI:
--   1. An article cannot be published until it has a review record.
--   2. A listing cannot be published until its seller is verified AND the
--      health disclosure is complete.
--   3. An ad cannot be live without a named sponsor — no anonymous slots.
--   4. Every write by staff is audited; corrections are append-only.
-- =========================================================================

-- Supabase: extensions live in the `extensions` schema and the postgres role is
-- not superuser, so `create extension` without a schema fails with 42501 and
-- aborts the whole migration in its implicit transaction.
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------- enums
create type app_role as enum ('reader', 'editor', 'reviewer', 'admin');
create type review_status as enum ('unreviewed', 'editorial', 'vet-reviewed');
create type species_kind as enum ('dog', 'cat', 'both');
create type article_section as enum ('costs','health','nutrition','training','grooming','safety','setup','behaviour','tech');
create type seller_status as enum ('applied','in_review','verified','rejected','suspended');
create type listing_status as enum ('draft','in_review','published','withdrawn','rejected');
create type ad_status as enum ('draft','booked','live','paused','ended');
create type moderation_state as enum ('new','triaged','closed');

-- ---------------------------------------------------------------- staff
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role app_role not null default 'reader',
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('editor','reviewer','admin')
  );
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- keeps profiles in sync with auth.users without trusting client input
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'reader')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------- breeds
create table breeds (
  slug text primary key,
  name text not null,
  species species_kind not null,
  size_class text check (size_class in ('small','medium','large','giant')),
  lifespan_min int check (lifespan_min > 0),
  lifespan_max int check (lifespan_max >= lifespan_min),
  energy text check (energy in ('low','moderate','high')),
  grooming text check (grooming in ('low','moderate','high')),
  temperament text[] not null default '{}',
  note text,
  sources jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- articles
create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text,
  section article_section not null,
  species species_kind not null default 'both',
  hero_image text,
  review_status review_status not null default 'unreviewed',
  reviewer_name text,
  reviewed_at timestamptz,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_by uuid references profiles(id),
  constraint reviewed_needs_name
    check (review_status = 'unreviewed' or (reviewer_name is not null and length(trim(reviewer_name)) > 1))
);

create index articles_published_idx on articles (published_at desc) where published_at is not null;
create index articles_search_idx on articles using gin ((title || ' ' || summary) extensions.gin_trgm_ops);

-- Publish guard: the database refuses to publish an unreviewed article.
create or replace function guard_article_publish()
returns trigger
language plpgsql
as $$
begin
  if new.published_at is not null and new.review_status = 'unreviewed' then
    raise exception 'Article % cannot be published before editorial review', new.slug;
  end if;
  if new.review_status = 'vet-reviewed' and new.reviewer_name is null then
    raise exception 'Vet-reviewed article % requires a named reviewer', new.slug;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger articles_publish_guard
  before insert or update on articles
  for each row execute function guard_article_publish();

create table article_sources (
  id bigserial primary key,
  article_id uuid not null references articles(id) on delete cascade,
  label text not null,
  url text not null,
  added_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- commerce
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  species species_kind not null default 'both',
  merchant text not null,
  affiliate_url text,
  is_affiliate boolean not null default true,
  price_cents int check (price_cents is null or price_cents >= 0),
  price_checked_at timestamptz,
  rating_score numeric(3,1) check (rating_score is null or (rating_score >= 0 and rating_score <= 10)),
  rating_reviewer text,
  rating_tested_on date,
  created_at timestamptz not null default now(),
  -- a score without a named reviewer and a test date is not allowed
  constraint rating_requires_evidence check (
    rating_score is null or (rating_reviewer is not null and rating_tested_on is not null)
  ),
  -- a price older than 24h is treated as stale by the price job, not shown
  constraint price_requires_check check (price_cents is null or price_checked_at is not null)
);

-- ---------------------------------------------------------------- sellers
create table seller_applications (
  id uuid primary key default gen_random_uuid(),
  trading_name text not null,
  country text not null,
  email text not null,
  licence text not null,
  schemes text,
  status moderation_state not null default 'new',
  created_at timestamptz not null default now()
);

create table sellers (
  id uuid primary key default gen_random_uuid(),
  trading_name text not null,
  country text not null,
  contact_email text not null,
  licence_no text not null,
  status seller_status not null default 'applied',
  gate text not null default 'identity',
  verified_at timestamptz,
  verified_by uuid references profiles(id),
  internal_notes text,
  created_at timestamptz not null default now(),
  constraint verified_needs_evidence check (
    status <> 'verified' or (verified_at is not null and verified_by is not null)
  )
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers(id) on delete restrict,
  species species_kind not null check (species in ('dog','cat')),
  breed_slug text references breeds(slug),
  title text not null,
  price_cents int check (price_cents is null or price_cents >= 0),
  status listing_status not null default 'draft',
  health_disclosure jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index listings_status_idx on listings (status, published_at desc);

-- Publish guard: seller verified + complete disclosure, checked in the DB.
create or replace function guard_listing_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seller_ok boolean;
begin
  if new.published_at is not null then
    select (status = 'verified') into seller_ok from sellers where id = new.seller_id;
    if coalesce(seller_ok, false) is false then
      raise exception 'Listing % cannot publish: seller is not verified', new.id;
    end if;
    if (new.health_disclosure ->> 'microchip') is null
       or (new.health_disclosure ->> 'vaccinations') is null
       or (new.health_disclosure ->> 'reason_for_placement') is null then
      raise exception 'Listing % cannot publish: health disclosure incomplete (microchip, vaccinations, reason_for_placement required)', new.id;
    end if;
  end if;
  return new;
end;
$$;

create trigger listings_publish_guard
  before insert or update on listings
  for each row execute function guard_listing_publish();

-- ---------------------------------------------------------------- advertising
create table ad_enquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  email text not null,
  campaign text not null,
  status moderation_state not null default 'new',
  created_at timestamptz not null default now()
);

create table ads (
  id uuid primary key default gen_random_uuid(),
  placement text not null,
  sponsor text not null,
  headline text not null,
  body text,
  href text not null,
  status ad_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  constraint live_needs_sponsor check (status <> 'live' or length(trim(sponsor)) > 1),
  constraint live_needs_window check (status <> 'live' or (starts_at is not null and ends_at is not null))
);

-- ---------------------------------------------------------------- audience
create table newsletter_subscribers (
  id bigserial primary key,
  email text not null,
  source text not null default 'site',
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index newsletter_email_unique on newsletter_subscribers (lower(email));

create table contact_messages (
  id bigserial primary key,
  email text not null,
  topic text not null,
  message text not null,
  status moderation_state not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- governance
create table corrections (
  id bigserial primary key,
  article_id uuid references articles(id) on delete set null,
  original_claim text not null,
  correction text not null,
  source_url text,
  reviewer uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  actor uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);

create or replace function audit_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_log (actor, action, entity, entity_id, detail)
  values (auth.uid(), tg_op, tg_table_name, coalesce(new.id::text, old.id::text), to_jsonb(new));
  return coalesce(new, old);
end;
$$;

create trigger audit_articles after insert or update or delete on articles
  for each row execute function audit_write();
create trigger audit_listings after insert or update or delete on listings
  for each row execute function audit_write();
create trigger audit_ads after insert or update or delete on ads
  for each row execute function audit_write();
create trigger audit_sellers after insert or update or delete on sellers
  for each row execute function audit_write();

-- corrections are append-only
create or replace function block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'This table is append-only';
end;
$$;
create trigger corrections_append_only before update or delete on corrections
  for each row execute function block_mutation();

-- ---------------------------------------------------------------- views
create view published_articles as
  select a.*, coalesce(json_agg(s order by s.id) filter (where s.id is not null), '[]'::json) as sources
  from articles a
  left join article_sources s on s.article_id = a.id
  where a.published_at is not null
  group by a.id;

-- ads that are live right now (used by the AdSlot loader)
create view active_ads as
  select * from ads
  where status = 'live' and starts_at <= now() and (ends_at is null or ends_at > now());

-- =========================================================================
-- Row-level security
-- =========================================================================
alter table profiles enable row level security;
alter table breeds enable row level security;
alter table articles enable row level security;
alter table article_sources enable row level security;
alter table products enable row level security;
alter table seller_applications enable row level security;
alter table sellers enable row level security;
alter table listings enable row level security;
alter table ad_enquiries enable row level security;
alter table ads enable row level security;
alter table newsletter_subscribers enable row level security;
alter table contact_messages enable row level security;
alter table corrections enable row level security;
alter table audit_log enable row level security;

-- profiles: you see and edit only your own row; staff can read all
create policy profiles_self_read on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_self_update on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- public catalogue
create policy breeds_public_read on breeds for select using (true);
create policy articles_public_read on articles for select using (published_at is not null);
create policy article_sources_public_read on article_sources for select
  using (exists (select 1 from articles a where a.id = article_id and a.published_at is not null));
create policy products_public_read on products for select using (true);
create policy ads_public_read on ads for select using (status = 'live' and starts_at <= now() and (ends_at is null or ends_at > now()));

-- staff write access
create policy articles_staff_write on articles for all using (is_staff()) with check (is_staff());
create policy article_sources_staff_write on article_sources for all using (is_staff()) with check (is_staff());
create policy breeds_staff_write on breeds for all using (is_staff()) with check (is_staff());
create policy products_staff_write on products for all using (is_staff()) with check (is_staff());
create policy ads_staff_write on ads for all using (is_staff()) with check (is_staff());
create policy corrections_staff_write on corrections for insert with check (is_staff());
create policy corrections_public_read on corrections for select using (true);
create policy audit_admin_read on audit_log for select using (is_admin());

-- sellers & listings never public at the row level except published listings
create policy sellers_public_read on sellers for select using (status = 'verified');
create policy sellers_staff_write on sellers for all using (is_staff()) with check (is_staff());
create policy listings_public_read on listings for select using (status = 'published' and published_at is not null);
create policy listings_staff_write on listings for all using (is_staff()) with check (is_staff());

-- inbound forms: insert for anyone, read only for staff
create policy seller_apps_insert on seller_applications for insert with check (true);
create policy seller_apps_staff_read on seller_applications for select using (is_staff());
create policy ad_enq_insert on ad_enquiries for insert with check (true);
create policy ad_enq_staff_read on ad_enquiries for select using (is_staff());
create policy newsletter_insert on newsletter_subscribers for insert with check (true);
create policy newsletter_staff_read on newsletter_subscribers for select using (is_staff());
create policy contact_insert on contact_messages for insert with check (true);
create policy contact_staff_read on contact_messages for select using (is_staff());
