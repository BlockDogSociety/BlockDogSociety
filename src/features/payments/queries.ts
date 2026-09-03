import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type PaidOrder = {
  id: string;
  createdAt: string;
  amountTotal: number;
  buyerEmail: string | null;
  shippingName: string | null;
  shippingAddress: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  } | null;
};

// Admin-only: uses the service-role client since it needs to join order
// data with auth.users (buyer email), which anon/authenticated can't read.
export async function getPaidOrders(): Promise<PaidOrder[]> {
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from("calendar_orders")
    .select("id, created_at, amount_total, buyer_id, shipping_name, shipping_address")
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  if (error || !orders) {
    return [];
  }

  const results: PaidOrder[] = [];
  for (const order of orders) {
    const { data } = await supabase.auth.admin.getUserById(order.buyer_id);
    results.push({
      id: order.id,
      createdAt: order.created_at,
      amountTotal: order.amount_total,
      buyerEmail: data.user?.email ?? null,
      shippingName: order.shipping_name,
      shippingAddress: order.shipping_address,
    });
  }

  return results;
}
