import type { CSSProperties, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { useDrawerStackItem } from '@papercusp/drawer-stack';

export interface CartDrawerShellProps {
  /** drawer-stack pane id (stable per surface, e.g. 'quick-quote'). */
  id: string;
  /** drawer-stack ordering priority. */
  priority?: number;
  /** Pane width — any CSS width expression (e.g. 'var(--cd-drawer-width)'). */
  width?: string;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  /** Accessible name for the drawer dialog (also the sr-only Vaul title). */
  ariaLabel: string;
  /** sr-only longer description for screen readers. */
  a11yDescription?: string;
  /** DOM id for the drawer content (aria-controls target). */
  contentId?: string;
  /** Class for the Vaul content pane; defaults to the lib's .cd-drawer-shell. */
  contentClassName?: string;
  /** Extra style merged over the stack's paneStyle on the content pane. */
  contentStyle?: CSSProperties;
  /**
   * The always-mounted trigger, rendered inside the drawer-stack's shared
   * trigger rail. Receives the stack-managed open state.
   */
  renderTrigger: (ctx: { open: boolean }) => ReactNode;
  /** Drawer body — compose CartDrawerHeader / your own views / CartDrawerFooter. */
  children: ReactNode;
}

/**
 * The drawer chrome: registers with @papercusp/drawer-stack (shared trigger
 * rail, side-by-side pane placement, shared backdrop, ESC + scroll-lock) and
 * renders a right-edge non-modal Vaul drawer whose pane docks via paneStyle.
 * Extracted from Restart CartShell — behavior-identical chrome, all app
 * content injected via renderTrigger/children.
 */
export function CartDrawerShell({
  id,
  priority = 20,
  width = 'var(--cd-drawer-width, min(28rem, calc(100vw - 1rem)))',
  open,
  onOpenChange,
  ariaLabel,
  a11yDescription,
  contentId,
  contentClassName,
  contentStyle,
  renderTrigger,
  children,
}: CartDrawerShellProps) {
  const { Trigger, paneStyle } = useDrawerStackItem({ id, priority, open, onOpenChange, width });
  return (
    <>
      <Trigger>{renderTrigger({ open })}</Trigger>
      <VaulDrawer.Root direction="right" open={open} modal={false} onOpenChange={onOpenChange}>
        <VaulDrawer.Portal>
          <VaulDrawer.Content
            id={contentId}
            className={contentClassName ?? 'cd-drawer-shell'}
            data-open={open}
            aria-label={ariaLabel}
            style={{ ...paneStyle, outline: 'none', ...contentStyle }}
          >
            <VaulDrawer.Title className="cd-sr-only">{ariaLabel}</VaulDrawer.Title>
            {a11yDescription ? (
              <VaulDrawer.Description className="cd-sr-only">{a11yDescription}</VaulDrawer.Description>
            ) : null}
            {children}
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </>
  );
}
