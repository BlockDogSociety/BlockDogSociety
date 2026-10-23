export const CURRENCY = "cad";

export const CALENDAR_PRICE_CENTS = Number(process.env.CALENDAR_PRICE_CENTS || 2500);

// Flat-rate shipping estimates, not real-time carrier calculation. Several
// calendars travel in one parcel, so each extra one adds less than the first.
export const SHIPPING_RATE_CA_CENTS = Number(process.env.SHIPPING_RATE_CA_CENTS || 500);
export const SHIPPING_RATE_INTL_CENTS = Number(process.env.SHIPPING_RATE_INTL_CENTS || 1000);
export const SHIPPING_EXTRA_CA_CENTS = Number(process.env.SHIPPING_EXTRA_CA_CENTS || 200);
export const SHIPPING_EXTRA_INTL_CENTS = Number(process.env.SHIPPING_EXTRA_INTL_CENTS || 400);

export const MAX_CALENDARS_PER_ORDER = 20;

export function shippingCents(quantity: number, base: number, extra: number) {
  return base + extra * Math.max(0, quantity - 1);
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
