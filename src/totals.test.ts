import { describe, it, expect } from 'vitest';
import type { CartData } from './types';
import { getCartItemCount, getCartSubtotal, applyZeroedMask, clampQuantity } from './totals';

/** Ported from Restart apps/shop/src/lib/cart-totals.test.ts (T3.2). */

const cart = (items: Array<{ id: string; quantity: number; priceCents: number }>): CartData => ({
  id: 'c1',
  currency: 'USD',
  items: items.map((i) => ({
    id: i.id,
    productId: `p-${i.id}`,
    quantity: i.quantity,
    availableQty: null,
    product: { id: `p-${i.id}`, title: '', imageUrl: '', priceCents: i.priceCents },
  })),
});

describe('getCartItemCount', () => {
  it('sums quantities; 0 for null/empty', () => {
    expect(getCartItemCount(null)).toBe(0);
    expect(getCartItemCount(cart([]))).toBe(0);
    expect(getCartItemCount(cart([{ id: 'a', quantity: 2, priceCents: 100 }, { id: 'b', quantity: 3, priceCents: 50 }]))).toBe(5);
  });
});

describe('getCartSubtotal', () => {
  it('sums quantity × unit price (cents); 0 for null', () => {
    expect(getCartSubtotal(null)).toBe(0);
    expect(getCartSubtotal(cart([{ id: 'a', quantity: 2, priceCents: 100 }, { id: 'b', quantity: 1, priceCents: 500 }]))).toBe(700);
  });
});

describe('applyZeroedMask', () => {
  it('zeroes the masked lines, leaves others, and is a no-op for null/empty mask', () => {
    const c = cart([{ id: 'a', quantity: 2, priceCents: 100 }, { id: 'b', quantity: 3, priceCents: 50 }]);
    expect(applyZeroedMask(null, new Set(['a']))).toBeNull();
    expect(applyZeroedMask(c, new Set())).toBe(c); // unchanged reference

    const masked = applyZeroedMask(c, new Set(['a']))!;
    expect(masked.items.find((i) => i.id === 'a')!.quantity).toBe(0);
    expect(masked.items.find((i) => i.id === 'b')!.quantity).toBe(3);
    // original cart not mutated
    expect(c.items.find((i) => i.id === 'a')!.quantity).toBe(2);
  });

  it('preserves the concrete cart type through the mask (generic)', () => {
    type Rich = CartData & { extra: string };
    const rich: Rich = { ...cart([{ id: 'a', quantity: 1, priceCents: 10 }]), extra: 'kept' };
    const masked = applyZeroedMask(rich, new Set(['a']))!;
    expect(masked.extra).toBe('kept');
    expect(masked.items[0].quantity).toBe(0);
  });
});

describe('clampQuantity', () => {
  it('clamps to availableQty and flags over-max', () => {
    expect(clampQuantity(5, 3)).toEqual({ requested: 5, clamped: 3, overMax: true });
  });
  it('passes through within stock', () => {
    expect(clampQuantity(2, 3)).toEqual({ requested: 2, clamped: 2, overMax: false });
    expect(clampQuantity(3, 3)).toEqual({ requested: 3, clamped: 3, overMax: false });
  });
  it('floors negatives to 0', () => {
    expect(clampQuantity(-4, 3)).toEqual({ requested: 0, clamped: 0, overMax: false });
  });
  it('passes through when stock is unknown (null/undefined)', () => {
    expect(clampQuantity(99, null)).toEqual({ requested: 99, clamped: 99, overMax: false });
    expect(clampQuantity(99, undefined)).toEqual({ requested: 99, clamped: 99, overMax: false });
  });
});
