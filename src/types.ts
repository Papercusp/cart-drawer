/** Minimal structural shapes the drawer needs. App cart types (e.g. Restart's
 * shop-sdk Cart) are richer supersets and remain assignable — the generics on
 * the totals helpers preserve the app's concrete type through transforms. */

export interface CartLineProduct {
  id: string;
  title: string;
  imageUrl?: string | null;
  priceCents: number;
}

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  /** Known purchasable stock; null/undefined = unknown (no clamp). */
  availableQty?: number | null;
  product: CartLineProduct;
}

export interface CartData {
  id: string;
  currency?: string | null;
  items: CartLine[];
}

/** The structural floor for the pure math helpers. */
export interface CartLike {
  items: Array<{ id: string; quantity: number; product: { priceCents: number } }>;
}
