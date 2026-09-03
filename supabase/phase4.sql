-- Phase 4: shipping address capture. Run this in the SQL Editor.
-- (Safe to run more than once.)

alter table public.calendar_orders
  add column if not exists shipping_name text,
  add column if not exists shipping_address jsonb;
