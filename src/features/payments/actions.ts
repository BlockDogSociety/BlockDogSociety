"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CALENDAR_PRICE_CENTS,
  CURRENCY,
  MAX_CALENDARS_PER_ORDER,
  SHIPPING_EXTRA_CA_CENTS,
  SHIPPING_EXTRA_INTL_CENTS,
  SHIPPING_RATE_CA_CENTS,
  SHIPPING_RATE_INTL_CENTS,
  shippingCents,
} from "@/lib/pricing";

export async function createCheckoutSession(quantity: number) {
  // Comes from the browser, so clamp it rather than trusting it.
  const qty = Math.min(
    MAX_CALENDARS_PER_ORDER,
    Math.max(1, Math.floor(Number(quantity) || 1)),
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: { name: "Block Dog Society Calendar" },
          unit_amount: CALENDAR_PRICE_CENTS,
        },
        quantity: qty,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/calendar/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/calendar`,
    customer_email: user.email,
    metadata: { buyer_id: user.id },
    // "ZZ" is Stripe's built-in "Rest of world" code — together with CA/US
    // this covers every destination without enumerating ~240 countries.
    shipping_address_collection: { allowed_countries: ["CA", "US", "ZZ"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingCents(qty, SHIPPING_RATE_CA_CENTS, SHIPPING_EXTRA_CA_CENTS),
            currency: CURRENCY,
          },
          display_name: "Canada",
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingCents(qty, SHIPPING_RATE_INTL_CENTS, SHIPPING_EXTRA_INTL_CENTS),
            currency: CURRENCY,
          },
          display_name: "US & International",
        },
      },
    ],
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  const { error } = await supabase.from("calendar_orders").insert({
    buyer_id: user.id,
    stripe_session_id: session.id,
    status: "pending",
    quantity: qty,
    amount_total: CALENDAR_PRICE_CENTS * qty,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(session.url);
}
