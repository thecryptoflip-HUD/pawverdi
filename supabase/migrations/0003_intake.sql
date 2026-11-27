-- Only validated server-side submissions can insert into private inboxes.
drop policy if exists seller_apps_insert on public.seller_applications;
drop policy if exists ad_enq_insert on public.ad_enquiries;
drop policy if exists newsletter_insert on public.newsletter_subscribers;
drop policy if exists contact_insert on public.contact_messages;
revoke insert on public.seller_applications, public.ad_enquiries,
  public.newsletter_subscribers, public.contact_messages from public, anon, authenticated;

create table public.intake_limits (
  bucket_key text primary key,
  expires_at timestamptz not null,
  attempts integer not null
);
create index intake_limit_expiry on public.intake_limits(expires_at);
alter table public.intake_limits enable row level security;
revoke all on public.intake_limits from public, anon, authenticated;

-- A conditional upsert serialises concurrent requests to the same bucket.
create function public.claim_intake_slot(p_key text, p_max integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare accepted boolean;
begin
  if p_max not between 1 and 100 or p_key !~ '^[a-f0-9]{64}$' then
    return false;
  end if;
  delete from public.intake_limits where expires_at <= now();
  insert into public.intake_limits as limits(bucket_key,expires_at,attempts)
  values(p_key,now() + interval '15 minutes',1)
  on conflict (bucket_key) do update set attempts=limits.attempts+1
  where limits.attempts < p_max returning true into accepted;
  return coalesce(accepted,false);
end;
$$;
revoke all on function public.claim_intake_slot(text,integer) from public, anon, authenticated;
grant execute on function public.claim_intake_slot(text,integer) to service_role;
