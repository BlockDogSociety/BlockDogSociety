"use client";

import { useTransition } from "react";
import { createCheckoutSession } from "@/features/payments/actions";

export function BuyButton({ priceDisplay }: { priceDisplay: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => createCheckoutSession())}
      className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
    >
      {pending ? "Redirecting to checkout..." : `Buy the calendar — ${priceDisplay}`}
    </button>
  );
}
