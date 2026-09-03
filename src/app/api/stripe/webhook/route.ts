import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();
    const shipping = session.collected_information?.shipping_details;

    await supabase
      .from("calendar_orders")
      .update({
        status: "paid",
        // The pre-checkout amount_total we inserted was a guess — this is
        // the real total, including whichever shipping option they picked.
        amount_total: session.amount_total,
        shipping_name: shipping?.name ?? null,
        shipping_address: shipping?.address ?? null,
      })
      .eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
