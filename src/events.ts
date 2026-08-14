/**
 * Namespaced cart window-events: item-added (with a fly-animation source rect),
 * open, toggle. Generalized from Restart apps/shop/src/components/cart-events.ts
 * — an app creates one instance per cart surface, e.g.
 * `createCartEvents<Cart>('shop')` reproduces the original 'shop:cart-*' names.
 */

export interface CartAnimationRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CartItemAddedDetail<TCart = unknown> {
  productId: string;
  quantity: number;
  cart: TCart;
  productTitle?: string;
  imageUrl?: string | null;
  sourceRect?: CartAnimationRect | null;
}

export interface CartOpenDetail {
  source?: string;
  pulse?: boolean;
}

export function getElementRect(element: Element | null): CartAnimationRect | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

export interface CartEvents<TCart = unknown> {
  ITEM_ADDED: string;
  OPEN: string;
  TOGGLE: string;
  dispatchItemAdded(detail: CartItemAddedDetail<TCart>): void;
  dispatchOpen(detail?: CartOpenDetail): void;
  dispatchToggle(): void;
  onItemAdded(handler: (detail: CartItemAddedDetail<TCart>) => void): () => void;
  onOpen(handler: (detail: CartOpenDetail) => void): () => void;
  onToggle(handler: () => void): () => void;
}

export function createCartEvents<TCart = unknown>(namespace: string): CartEvents<TCart> {
  const ITEM_ADDED = `${namespace}:cart-item-added`;
  const OPEN = `${namespace}:cart-open`;
  const TOGGLE = `${namespace}:cart-toggle`;
  const ssr = () => typeof window === 'undefined';
  return {
    ITEM_ADDED,
    OPEN,
    TOGGLE,
    dispatchItemAdded(detail) {
      if (ssr()) return;
      window.dispatchEvent(new CustomEvent(ITEM_ADDED, { detail }));
    },
    dispatchOpen(detail = {}) {
      if (ssr()) return;
      window.dispatchEvent(new CustomEvent(OPEN, { detail }));
    },
    dispatchToggle() {
      if (ssr()) return;
      window.dispatchEvent(new CustomEvent(TOGGLE));
    },
    onItemAdded(handler) {
      if (ssr()) return () => {};
      const listener = (event: Event) => handler((event as CustomEvent<CartItemAddedDetail<TCart>>).detail);
      window.addEventListener(ITEM_ADDED, listener);
      return () => window.removeEventListener(ITEM_ADDED, listener);
    },
    onOpen(handler) {
      if (ssr()) return () => {};
      const listener = (event: Event) => handler((event as CustomEvent<CartOpenDetail>).detail ?? {});
      window.addEventListener(OPEN, listener);
      return () => window.removeEventListener(OPEN, listener);
    },
    onToggle(handler) {
      if (ssr()) return () => {};
      const listener = () => handler();
      window.addEventListener(TOGGLE, listener);
      return () => window.removeEventListener(TOGGLE, listener);
    },
  };
}
