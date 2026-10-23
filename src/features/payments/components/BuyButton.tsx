"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/features/payments/actions";
import {
  CALENDAR_PRICE_CENTS,
  MAX_CALENDARS_PER_ORDER,
  SHIPPING_EXTRA_CA_CENTS,
  SHIPPING_RATE_CA_CENTS,
  formatPrice,
  shippingCents,
} from "@/lib/pricing";

export function BuyButton() {
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const calendars = CALENDAR_PRICE_CENTS * quantity;
  const shipping = shippingCents(quantity, SHIPPING_RATE_CA_CENTS, SHIPPING_EXTRA_CA_CENTS);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm font-medium">
          How many?
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={pending}
          className="rounded-md border px-3 py-2"
        >
          {Array.from({ length: MAX_CALENDARS_PER_ORDER }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">
        {quantity} {quantity === 1 ? "calendar" : "calendars"} {formatPrice(calendars)} +{" "}
        {formatPrice(shipping)} shipping within Canada ={" "}
        <span className="font-medium text-black">{formatPrice(calendars + shipping)}</span>.
        Shipping outside Canada costs more and is shown at checkout.
      </p>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => createCheckoutSession(quantity))}
        className="self-start rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Redirecting to checkout..." : "Buy now"}
      </button>
    </div>
  );
}
