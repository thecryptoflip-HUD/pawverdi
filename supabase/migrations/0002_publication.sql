begin;
create table public.publication_entries (
 id uuid primary key default gen_random_uuid(),
 kind text not null check (kind in ('article','deal','product','campaign','category','merchant','media','homepage')),
 slug text not null unique check (length(slug) between 1 and 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (length(trim(title)) between 1 and 160),
 summary text not null check (length(trim(summary)) between 1 and 400),
 body text not null check (length(body) <= 30000),
 state text not null default 'draft' check (state in ('draft','review','published','archived')),
 category text not null default '' check (length(category)<=100),
 species text not null default 'all' check (species in ('all','dog','cat','bird','small-animal','fish','reptile')),
 merchant text not null default '' check (length(merchant)<=160),
 brand text not null default '' check (length(brand)<=160),
 price_cents int check (price_cents is null or (kind='product' and price_cents>=0)),
 price_checked_at timestamptz,
 check ((price_cents is null) = (price_checked_at is null)),
 destination_url text check (length(destination_url)<=2048 and destination_url ~ '^https://[A-Za-z0-9.-]+(:[0-9]+)?([/?#][^[:space:]]*)?$'),
 disclosure text not null default '' check (length(disclosure)<=400),
 featured boolean not null default false,
 expires_at timestamptz,
 verified_at timestamptz,
 revision integer not null default 1,
 updated_at timestamptz not null default now(),
 check (state <> 'published' or kind not in ('deal','campaign') or (expires_at is not null and destination_url is not null and trim(merchant) <> '' and trim(disclosure) <> '')),
 check (state <> 'published' or destination_url is null or trim(disclosure) <> '')
);
alter table public.publication_entries enable row level security;
revoke all on public.publication_entries from public, anon, authenticated;
grant select on public.publication_entries to anon, authenticated;
grant insert, update on public.publication_entries to authenticated;
create policy publication_public on public.publication_entries for select using
 (state='published' and (expires_at is null or expires_at > now()));
create policy publication_staff_read on public.publication_entries for select to authenticated using (public.is_staff());
create policy publication_create on public.publication_entries for insert to authenticated with check (public.is_staff() and state='draft');
create policy publication_edit on public.publication_entries for update to authenticated using (public.is_staff()) with check (public.is_staff());
create function public.check_publication_change() returns trigger language plpgsql set search_path=public as $$
declare
 approver boolean;
begin
 if new.price_checked_at > now() then raise exception 'Price verification cannot be in the future'; end if;
 if tg_op='INSERT' then
   if new.state <> 'draft' then raise exception 'New entries start as drafts'; end if;
   new.verified_at := null;
   new.revision := 1;
 else
   select exists(select 1 from public.profiles where id=auth.uid() and role in ('reviewer','admin')) into approver;
   if new.id <> old.id then raise exception 'Entry identity is immutable'; end if;
   if old.state='published' and new.state not in ('archived','draft') then raise exception 'Return published content to draft before editing'; end if;
   if old.state in ('published','archived') and not approver then raise exception 'Reviewer access required'; end if;
   if new.state='published' and (old.state <> 'review' or not approver) then raise exception 'Reviewer approval required'; end if;
   if new.state='archived' and not approver then raise exception 'Reviewer access required'; end if;
   if old.state='archived' and new.state <> 'draft' then raise exception 'Restore to draft first'; end if;
   if new.state='published' and new.expires_at <= now() then raise exception 'Offer already expired'; end if;
   new.verified_at := case when new.state='published' then now() end;
   new.revision := old.revision+1;
 end if;
 new.updated_at := now();
 return new;
end; $$;
create trigger publication_guard before insert or update on public.publication_entries for each row execute function public.check_publication_change();
create trigger publication_audit after insert or update on public.publication_entries for each row execute function public.audit_write();
create index publication_lookup on public.publication_entries (kind, updated_at desc) where state='published';
-- A verified seller's contact address, license number and staff notes remain private.
drop policy sellers_public_read on public.sellers;
create function public.audit_queue_status() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into audit_log(actor,action,entity,entity_id,detail)
 values(auth.uid(),'UPDATE',tg_table_name,new.id::text,jsonb_build_object('previous',old.status,'status',new.status));
 return new;
end; $$;
do $$
declare queue_name text;
begin
 foreach queue_name in array array['contact_messages','seller_applications','ad_enquiries'] loop
  execute format('revoke update on %I from public, anon, authenticated', queue_name);
  execute format('grant update(status) on %I to authenticated', queue_name);
  execute format('create policy staff_triage on %I for update to authenticated using (public.is_staff()) with check (public.is_staff())',queue_name);
  execute format('create trigger triage_audit after update of status on %I for each row execute function public.audit_queue_status()',queue_name);
 end loop;
end; $$;
commit;
