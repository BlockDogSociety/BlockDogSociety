"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/features/contact/actions";

const initialState: ContactState = { message: null, error: null };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-sm font-medium">
          What&apos;s this about?
        </label>
        <select
          id="type"
          name="type"
          required
          className="rounded-md border px-3 py-2"
        >
          <option value="rescue_recommendation">Recommend a shelter/rescue</option>
          <option value="question">Question, comment, or concern</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name (optional)
        </label>
        <input id="name" name="name" type="text" className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email (optional, if you&apos;d like a reply)
        </label>
        <input id="email" name="email" type="email" className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-md border px-3 py-2"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-green-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
