import type { ReactNode } from 'react';

/** Full-height column container for the drawer body (card surface). */
export function CartDrawerSurface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ?? 'cd-surface'}>{children}</div>;
}

export interface CartDrawerHeaderProps {
  icon?: ReactNode;
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Small stat chips under the description (e.g. "3 lines", "7 units"). */
  chips?: ReactNode;
  onClose: () => void;
  closeLabel: string;
  closeIcon?: ReactNode;
}

/** Drawer header: icon badge + kicker/title/description + close button. */
export function CartDrawerHeader({ icon, kicker, title, description, chips, onClose, closeLabel, closeIcon }: CartDrawerHeaderProps) {
  return (
    <div className="cd-header">
      <div className="cd-header-main">
        {icon ? <span className="cd-header-icon">{icon}</span> : null}
        <div className="cd-header-copy">
          {kicker ? <p className="cd-header-kicker">{kicker}</p> : null}
          <h2 className="cd-header-title">{title}</h2>
          {description ? <p className="cd-header-desc">{description}</p> : null}
          {chips ? <div className="cd-header-chips">{chips}</div> : null}
        </div>
      </div>
      <button type="button" className="cd-header-close" onClick={onClose} aria-label={closeLabel}>
        {closeIcon ?? <span aria-hidden="true">×</span>}
      </button>
    </div>
  );
}

/** Stat chip used in the header (and anywhere else). */
export function CartChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' }) {
  return <span className={tone === 'accent' ? 'cd-chip cd-chip-accent' : 'cd-chip'}>{children}</span>;
}

/** Scrollable middle region of the drawer. */
export function CartDrawerBody({ children }: { children: ReactNode }) {
  return <div className="cd-body">{children}</div>;
}

/** Footer container (subtotal panel + CTAs live here). */
export function CartDrawerFooter({ children }: { children: ReactNode }) {
  return <div className="cd-footer">{children}</div>;
}

export interface CartSubtotalPanelProps {
  label: ReactNode;
  sublabel?: ReactNode;
  /** Formatted amount (the app owns currency formatting). */
  amount: ReactNode;
  note?: ReactNode;
}

/** The "Estimated total" panel. */
export function CartSubtotalPanel({ label, sublabel, amount, note }: CartSubtotalPanelProps) {
  return (
    <div className="cd-subtotal">
      <div className="cd-subtotal-row">
        <div>
          <p className="cd-subtotal-label">{label}</p>
          {sublabel ? <p className="cd-subtotal-sublabel">{sublabel}</p> : null}
        </div>
        <p className="cd-subtotal-amount">{amount}</p>
      </div>
      {note ? <p className="cd-subtotal-note">{note}</p> : null}
    </div>
  );
}

/** Loading skeleton rows for the cart body. */
export function CartSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="cd-lines">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="cd-skeleton-row" />
      ))}
    </div>
  );
}

export interface CartErrorNoticeProps {
  message: ReactNode;
  retryLabel?: ReactNode;
  onRetry?: () => void;
}

/** Inline error notice with an optional retry action. */
export function CartErrorNotice({ message, retryLabel, onRetry }: CartErrorNoticeProps) {
  return (
    <div className="cd-error" role="alert">
      <div>{message}</div>
      {onRetry ? (
        <button type="button" className="cd-error-retry" onClick={onRetry}>
          {retryLabel ?? 'Retry'}
        </button>
      ) : null}
    </div>
  );
}

export interface CartEmptyStateProps {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}

/** Centered dashed-border empty state. */
export function CartEmptyState({ title, body, action }: CartEmptyStateProps) {
  return (
    <div className="cd-empty-wrap">
      <div className="cd-empty">
        <h3 className="cd-empty-title">{title}</h3>
        {body ? <p className="cd-empty-body">{body}</p> : null}
        {action}
      </div>
    </div>
  );
}
