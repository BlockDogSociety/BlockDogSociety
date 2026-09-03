-- Phase 6: dog stories + a contact/rescue-recommendation page. Run in the
-- SQL Editor. (Safe to run more than once.)

-- ── dog stories ──────────────────────────────────────────────────────────
alter table public.dogs
  add column if not exists story text;

-- dog_standings needs to expose the new column too.
create or replace view public.dog_standings as
select
  d.id,
  d.name,
  d.story,
  d.photo_path,
  d.owner_id,
  d.selected_for_calendar,
  d.created_at,
  count(v.id)::int as vote_count
from public.dogs d
left join public.votes v on v.dog_id = d.id
group by d.id;

grant select on public.dog_standings to anon, authenticated;

-- ── contact_submissions ──────────────────────────────────────────────────
-- Rescue/shelter recommendations and general questions/comments. No login
-- required to submit — anyone can send one, only the admin can read them.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('rescue_recommendation', 'question')),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Anyone can submit" on public.contact_submissions;
create policy "Anyone can submit"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- No select policy for anon/authenticated on purpose — only the admin
-- (via the service-role key) can read submissions.
