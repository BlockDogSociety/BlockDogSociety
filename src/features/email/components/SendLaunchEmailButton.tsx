"use client";

import { useActionState } from "react";
import { sendLaunchEmail, type SendEmailState } from "@/features/email/actions";

const initialState: SendEmailState = { message: null };

export function SendLaunchEmailButton() {
  const [state, formAction, pending] = useActionState(sendLaunchEmail, initialState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Sending..." : "Email everyone: calendar is live"}
      </button>
      {state.message && <p className="text-sm text-gray-500">{state.message}</p>}
    </form>
  );
}
