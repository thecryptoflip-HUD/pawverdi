create table public.tracking_events (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('product','guide','deal','campaign')),
  slug text not null,
  merchant text not null,
  event text not null check (event in ('click','impression')),
  attribution text not null,
  campaign text,
  created_at timestamptz not null default now()
);
alter table public.tracking_events enable row level security;
revoke all on public.tracking_events from anon, authenticated;
grant select on public.tracking_events to authenticated;
grant insert,select on public.tracking_events to service_role;
grant usage,select on sequence public.tracking_events_id_seq to service_role;
create policy tracking_staff_read on public.tracking_events for select to authenticated using (public.is_staff());
create index tracking_events_report_idx on public.tracking_events (kind,slug,created_at);

-- Counts reflect visitors who consented. Reports never read identifiers or IP addresses.
create view public.commerce_performance with (security_invoker = true) as
select kind, slug, merchant, attribution, campaign,
  count(*) filter (where event = 'click') as clicks,
  count(*) filter (where event = 'impression') as impressions
from public.tracking_events
where created_at >= now() - interval '30 days'
group by kind, slug, merchant, attribution, campaign;
revoke all on public.commerce_performance from anon, authenticated;
grant select on public.commerce_performance to authenticated;

-- Daily totals transcribed from actual statements. Store no buyer information.
create table public.merchant_statements (
  merchant text not null check (length(trim(merchant)) between 1 and 100),
  report_date date not null,
  reference text not null check (length(trim(reference)) between 1 and 100),
  conversions integer not null check (conversions >= 0),
  commission_cents integer not null check (commission_cents >= 0),
  created_by uuid not null default auth.uid() references public.profiles(id),
  primary key (merchant,report_date,reference)
);
alter table public.merchant_statements enable row level security;
revoke all on public.merchant_statements from anon, authenticated;
grant select,insert on public.merchant_statements to authenticated;
create policy statements_staff_read on public.merchant_statements for select to authenticated using (public.is_staff());
create policy statements_admin_insert on public.merchant_statements for insert to authenticated
with check (public.is_admin() and created_by = auth.uid() and report_date <= current_date);
