import type { CartLike } from './types';

/**
 * Pure cart math + the local "saved line" mask. Extracted from Restart
 * CartShell (apps/shop/src/lib/cart-totals.ts) so any consumer can unit-test
 * them without rendering a component. Generic over the app's cart type.
 */

/** Total units across all cart lines. */
export function getCartItemCount(cart: CartLike | null): number {
  return (cart?.items ?? []).reduce((total, item) => total + item.quantity, 0);
}

/** Subtotal in cents = Σ quantity × line unit price. */
export function getCartSubtotal(cart: CartLike | null): number {
  return (cart?.items ?? []).reduce((total, item) => total + item.quantity * item.product.priceCents, 0);
}

/**
 * Layer locally "saved" (qty-0) lines over a cart without mutating it. Kept
 * separate from any data-layer mapper so the mapper stays pure; returns the
 * SAME reference when there is nothing to mask.
 */
export function applyZeroedMask<T extends CartLike>(cart: T | null, zeroedItemIds: Set<string>): T | null {
  if (!cart || zeroedItemIds.size === 0) return cart;
  return {
    ...cart,
    items: cart.items.map((i) => (zeroedItemIds.has(i.id) ? { ...i, quantity: 0 } : i)),
  } as T;
}

/**
 * Clamp a requested line quantity to [0, availableQty]. `overMax` flags a
 * request that exceeded available stock (the caller surfaces the alert). When
 * availableQty is null/undefined (unknown stock) the request passes through.
 */
export function clampQuantity(
  nextQuantity: number,
  availableQty: number | null | undefined,
): { requested: number; clamped: number; overMax: boolean } {
  const requested = Math.max(0, nextQuantity);
  const clamped = availableQty != null ? Math.min(requested, availableQty) : requested;
  const overMax = availableQty != null && requested > availableQty;
  return { requested, clamped, overMax };
}
