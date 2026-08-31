-- Phase 3 additions: run this in the SQL Editor after schema.sql.
-- (Safe to run more than once — every statement below is idempotent.)

-- Marks which dogs made the final top-12 cut for the calendar.
alter table public.dogs
  add column if not exists selected_for_calendar boolean not null default false;

-- ── calendar_orders ──────────────────────────────────────────────────────
create table if not exists public.calendar_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text not null unique,
  status text not null default 'pending', -- 'pending' | 'paid'
  amount_total integer not null,           -- cents
  created_at timestamptz not null default now()
);

alter table public.calendar_orders enable row level security;

drop policy if exists "Users can view their own orders" on public.calendar_orders;
create policy "Users can view their own orders"
  on public.calendar_orders for select
  to authenticated
  using (auth.uid() = buyer_id);

drop policy if exists "Users can create their own pending order" on public.calendar_orders;
create policy "Users can create their own pending order"
  on public.calendar_orders for insert
  to authenticated
  with check (auth.uid() = buyer_id);

-- No update policy for regular users: only the Stripe webhook (using the
-- service role key, which bypasses RLS entirely) marks an order as paid.

-- ── dog_standings view ───────────────────────────────────────────────────
-- Dogs with their live vote count, so we can order/limit by vote count
-- directly (e.g. "top 12") without doing it client-side.
create or replace view public.dog_standings as
select
  d.id,
  d.name,
  d.photo_path,
  d.owner_id,
  d.selected_for_calendar,
  d.created_at,
  count(v.id)::int as vote_count
from public.dogs d
left join public.votes v on v.dog_id = d.id
group by d.id;
