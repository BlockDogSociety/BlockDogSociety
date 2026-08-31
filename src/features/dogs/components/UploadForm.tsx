"use client";

import { useActionState } from "react";
import { uploadDog, type UploadDogState } from "@/features/dogs/actions";

const initialState: UploadDogState = { error: null };

export function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadDog, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Dog&apos;s name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="photo" className="text-sm font-medium">
          Photo
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          required
          className="rounded-md border px-3 py-2"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
