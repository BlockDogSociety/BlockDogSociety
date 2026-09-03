export const CURRENCY = "cad";

export const CALENDAR_PRICE_CENTS = Number(process.env.CALENDAR_PRICE_CENTS || 2500);

// Flat-rate shipping estimates, not real-time carrier calculation.
export const SHIPPING_RATE_CA_CENTS = Number(process.env.SHIPPING_RATE_CA_CENTS || 500);
export const SHIPPING_RATE_INTL_CENTS = Number(process.env.SHIPPING_RATE_INTL_CENTS || 1000);
