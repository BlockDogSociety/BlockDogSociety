-- Phase 10: multi-calendar orders. Run in the SQL Editor. (Safe to run more than once.)
--
-- Orders were always one calendar, so there was nothing to record. Buyers can
-- now order several at once and fulfilment needs to know how many. Existing
-- rows default to 1, which is what they were.
alter table public.calendar_orders
  add column if not exists quantity integer not null default 1;

alter table public.calendar_orders
  drop constraint if exists calendar_orders_quantity_positive;
alter table public.calendar_orders
  add constraint calendar_orders_quantity_positive check (quantity >= 1);
