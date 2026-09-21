-- Phase 8: downsized photo variants. Run in the SQL Editor. (Safe to run more than once.)
--
-- Serving the original multi-MB phone photo for every grid thumbnail blew
-- through Supabase's 5 GB/month egress quota. Uploads now also store a
-- 640px thumbnail and a 1600px display copy; the original is only used by
-- the admin crop tool. Both columns are nullable so older rows keep working
-- (the app falls back to photo_path) until they're backfilled.
alter table public.dogs add column if not exists thumb_path text;
alter table public.dogs add column if not exists display_path text;

-- New columns must go LAST — CREATE OR REPLACE VIEW can only append.
create or replace view public.dog_standings as
select
  d.id,
  d.name,
  d.photo_path,
  d.owner_id,
  d.selected_for_calendar,
  d.created_at,
  count(v.id)::int as vote_count,
  d.story,
  d.thumb_path,
  d.display_path
from public.dogs d
left join public.votes v on v.dog_id = d.id
group by d.id;

grant select on public.dog_standings to anon, authenticated;
