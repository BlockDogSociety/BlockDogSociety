"use client";

import { useActionState } from "react";
import { castVote, type VoteState } from "@/features/votes/actions";

const initialState: VoteState = { error: null };

export function VoteButton({
  dogId,
  voted = false,
  voteCount,
}: {
  dogId: string;
  voted?: boolean;
  voteCount?: number;
}) {
  const [state, formAction, pending] = useActionState(
    castVote.bind(null, dogId),
    initialState,
  );

  // Admins can vote repeatedly, so only lock the button for everyone else.
  const canVoteAgain = voteCount !== undefined;
  const showVoted = !canVoteAgain && (voted || pending || state.voted);

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <button
        type="submit"
        disabled={pending || showVoted}
        aria-pressed={showVoted}
        className={`w-full rounded-md border px-3 py-1.5 text-sm ${
          showVoted
            ? "border-black bg-black text-white"
            : "hover:bg-black hover:text-white disabled:opacity-50"
        }`}
      >
        {showVoted ? "✓ Voted" : `▲ Vote${canVoteAgain ? ` (${voteCount})` : ""}`}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
