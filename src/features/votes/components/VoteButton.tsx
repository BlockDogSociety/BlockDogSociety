"use client";

import { castVote } from "@/features/votes/actions";

export function VoteButton({
  dogId,
  voteCount,
}: {
  dogId: string;
  voteCount: number;
}) {
  return (
    <form action={castVote.bind(null, dogId)}>
      <button
        type="submit"
        className="w-full rounded-md border px-3 py-1.5 text-sm hover:bg-black hover:text-white"
      >
        ▲ Vote ({voteCount})
      </button>
    </form>
  );
}
