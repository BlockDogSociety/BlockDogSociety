-- Phase 7: voting limits. Run in the SQL Editor. (Safe to run more than once.)

-- Drop the one-vote-per-dog DB constraint — the admin needs to be exempt
-- from it (can vote for the same dog repeatedly), so this is now enforced
-- in the app instead (see castVote in features/votes/actions.ts), which
-- also caps regular users at 12 distinct dogs.
alter table public.votes drop constraint if exists votes_voter_id_dog_id_key;
