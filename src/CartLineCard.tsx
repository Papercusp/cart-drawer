import type { ReactNode } from 'react';
import type { CartLine } from './types';

export interface CartLineCardProps {
  item: CartLine;
  /** A write for this line is in flight — disables its controls. */
  busy?: boolean;
  /** Locally "saved" (qty-0) presentation state. */
  saved?: boolean;
  /** Badge shown when saved (e.g. "Saved"). Required if `saved` is used. */
  savedBadgeLabel?: ReactNode;
  /** Secondary type/category badge (already formatted). */
  typeBadge?: ReactNode;
  /** Resolved image URL (the app applies its own sizing/CDN transform). */
  imageSrc?: string | null;
  imageAlt?: string;
  /** Placeholder shown when there is no image. */
  imageFallback?: ReactNode;
  /** The app owns currency formatting. */
  formatPrice: (cents: number) => string;
  /** Suffix after the unit price (e.g. " each"). */
  unitPriceSuffix?: ReactNode;
  lineTotalLabel?: ReactNode;
  /** Placeholder for the line total when saved (default an em-dash). */
  savedLineTotal?: ReactNode;
  qtyLabel?: ReactNode;
  /** Controlled draft input value; falls back to String(item.quantity). */
  draftValue?: string;
  onDraftChange: (raw: string) => void;
  onCommitDraft: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  removeIcon?: ReactNode;
  /** Accessible labels — the app supplies localized copy. */
  labels: {
    increase: string;
    decrease: string;
    quantity: string;
    remove: string;
  };
  /** Transient per-line alert (e.g. "Only N available."). */
  alert?: string | null;
  /** Extra content under the controls row. */
  children?: ReactNode;
}

/**
 * One cart line: image, badges, title, unit price, line total, qty stepper
 * with a committable draft input, and remove. Extracted from Restart
 * CartShell's line article — DOM structure preserved, Tailwind utilities
 * ported to .cd-* token CSS.
 */
export function CartLineCard({
  item,
  busy = false,
  saved = false,
  savedBadgeLabel,
  typeBadge,
  imageSrc,
  imageAlt,
  imageFallback,
  formatPrice,
  unitPriceSuffix,
  lineTotalLabel,
  savedLineTotal,
  qtyLabel,
  draftValue,
  onDraftChange,
  onCommitDraft,
  onIncrement,
  onDecrement,
  onRemove,
  removeIcon,
  labels,
  alert,
  children,
}: CartLineCardProps) {
  return (
    <article className="cd-line-card" data-saved={saved || undefined}>
      <div className="cd-line-row">
        <div className="cd-line-media">
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt ?? ''} className="cd-line-img" />
          ) : (
            <div className="cd-line-img-fallback">{imageFallback}</div>
          )}
        </div>
        <div className="cd-line-main">
          <div className="cd-line-top">
            <div className="cd-line-titleblock">
              <div className="cd-line-badges">
                {saved && savedBadgeLabel ? <span className="cd-badge cd-badge-saved">{savedBadgeLabel}</span> : null}
                {typeBadge ? <span className="cd-badge cd-badge-type">{typeBadge}</span> : null}
              </div>
              <h3 className="cd-line-title">{item.product.title}</h3>
              <p className="cd-line-unit">
                <span className="cd-tnum">{formatPrice(item.product.priceCents)}</span>
                {unitPriceSuffix}
              </p>
            </div>
            <div className="cd-line-total">
              {lineTotalLabel ? <p className="cd-line-total-label">{lineTotalLabel}</p> : null}
              <p className="cd-line-total-amount">
                {saved ? <span className="cd-line-total-saved">{savedLineTotal ?? '—'}</span> : formatPrice(item.product.priceCents * item.quantity)}
              </p>
            </div>
          </div>
          <div className="cd-line-controls">
            <div className="cd-qty">
              {qtyLabel ? <span className="cd-qty-label">{qtyLabel}</span> : null}
              <div className="cd-stepper" data-saved={saved || undefined}>
                <button
                  type="button"
                  className="cd-stepper-btn"
                  onClick={onDecrement}
                  disabled={busy || saved}
                  aria-label={labels.decrease}
                >
                  &minus;
                </button>
                <input
                  type="number"
                  min="0"
                  value={draftValue ?? String(item.quantity)}
                  onChange={(e) => onDraftChange(e.target.value)}
                  onBlur={onCommitDraft}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  disabled={busy}
                  aria-label={labels.quantity}
                  className="cd-stepper-input"
                  data-saved={saved || undefined}
                />
                <button type="button" className="cd-stepper-btn" onClick={onIncrement} disabled={busy} aria-label={labels.increase}>
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              aria-label={labels.remove}
              className="cd-line-remove"
              data-saved={saved || undefined}
            >
              {removeIcon ?? <span aria-hidden="true">🗑</span>}
            </button>
          </div>
          {alert ? (
            <p className="cd-line-alert" role="status" aria-live="polite">
              {alert}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </article>
  );
}

/** Container that spaces a list of CartLineCards. */
export function CartLineList({ children }: { children: ReactNode }) {
  return <div className="cd-lines">{children}</div>;
}
