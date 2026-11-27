begin;
alter table public.publication_entries
 add column media_path text unique check (length(media_path)<160 and media_path ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}\.(jpg|png|webp|mp4|webm)$'),
 add column media_description text not null default '' check(length(media_description)<=500),
 add column media_credit text not null default '' check(length(media_credit)<=250),
 add constraint media_needs_attribution check (media_path is null or
  (split_part(media_path,'/',1)=id::text and length(trim(media_description))>0 and length(trim(media_credit))>0));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values ('publication-media','publication-media',false,4194304,
 array['image/jpeg','image/png','image/webp','video/mp4','video/webm']);
-- Uploads use the staff-authenticated server route. Read access is granted per approved entry.
create policy publication_media_read on storage.objects for select to anon,authenticated
 using(bucket_id='publication-media' and exists (
  select 1 from public.publication_entries p where p.media_path=storage.objects.name
  and (public.is_staff() or (p.state='published' and (p.expires_at is null or p.expires_at>now())))
 ));
commit;
