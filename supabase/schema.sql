-- Run this once in the Supabase Dashboard: SQL Editor -> New query -> paste -> Run.

-- ── dogs ──────────────────────────────────────────────────────────────────
create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  photo_path text not null,
  created_at timestamptz not null default now()
);

alter table public.dogs enable row level security;

create policy "Dogs are viewable by everyone"
  on public.dogs for select
  using (true);

create policy "Users can upload their own dog"
  on public.dogs for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can delete their own dog"
  on public.dogs for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ── votes ─────────────────────────────────────────────────────────────────
-- One row per (voter, dog). The unique constraint is what stops double voting.
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid not null references auth.users(id) on delete cascade,
  dog_id uuid not null references public.dogs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (voter_id, dog_id)
);

alter table public.votes enable row level security;

create policy "Vote counts are viewable by everyone"
  on public.votes for select
  using (true);

create policy "Users can cast their own vote"
  on public.votes for insert
  to authenticated
  with check (auth.uid() = voter_id);

create policy "Users can remove their own vote"
  on public.votes for delete
  to authenticated
  using (auth.uid() = voter_id);

-- ── storage: dog-photos bucket ───────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict (id) do nothing;

create policy "Dog photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'dog-photos');

-- Uploads are only allowed into a folder named after the uploader's own
-- user id (path convention: {user_id}/{filename}), enforced here so one
-- user can't write into another user's folder.
create policy "Users can upload into their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
