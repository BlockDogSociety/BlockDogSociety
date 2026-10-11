-- Phase 9: hand-framed calendar photos. Run in the SQL Editor. (Safe to run more than once.)
--
-- The calendar page let the browser centre-crop each photo, so the admin had
-- no say in the framing. The admin crop tool now saves a 3:2 crop per dog and
-- the calendar displays that instead. Nullable: dogs without one fall back to
-- the uncropped display copy.
alter table public.dogs add column if not exists calendar_crop_path text;

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
  d.display_path,
  d.calendar_crop_path
from public.dogs d
left join public.votes v on v.dog_id = d.id
group by d.id;

grant select on public.dog_standings to anon, authenticated;
