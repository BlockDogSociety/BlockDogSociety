"use client";

import { useActionState, useState } from "react";
import { deleteDog, type DeleteDogState } from "@/features/dogs/actions";

const initialState: DeleteDogState = { error: null };

export function DeleteDogButton({ dogId, dogName }: { dogId: string; dogName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(
    deleteDog.bind(null, dogId),
    initialState,
  );

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full rounded-md border border-red-600 px-3 py-1.5 text-sm text-red-600 hover:bg-red-600 hover:text-white"
      >
        Delete
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <p className="text-xs text-gray-500">Delete {dogName}? This can&apos;t be undone.</p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="flex-1 rounded-md border px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
