"use client";

import { finalizeCalendar } from "@/features/calendar/actions";

export function FinalizeButton() {
  return (
    <form action={finalizeCalendar}>
      <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
        Finalize top 12 for the calendar
      </button>
    </form>
  );
}
