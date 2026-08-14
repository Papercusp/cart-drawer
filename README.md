# @papercusp/cart-drawer

Themable, backend-agnostic cart drawer shell extracted from Restart
(shop.buyrestart.com) `CartShell.tsx`. Shared by Restart and SideStage as a git
submodule at `libs/cart-drawer`
(plan `sidestage/shared-cart-scout-drawer-libs-2026-08-14`, P-002).

## What lives here vs. in the app

- **Here:** the drawer chrome (Vaul + `@papercusp/drawer-stack` registration,
  side-by-side panes, a11y), line-item cards (qty stepper, committable draft
  input, remove, alerts, saved-state), header/footer/subtotal/empty/error/
  skeleton primitives, pure cart math (`totals.ts`), namespaced cart
  window-events (`createCartEvents`), and the fly-to-rail ghost layer.
- **In the app (the CartAdapter side):** the data layer (fetch/subscribe/mutate
  — Restart uses `@papercusp/sync` + shop-sdk; SideStage its holds/expiry
  APIs), currency formatting, copy/localization, icons, checkout panes, and the
  theme.

## Theming

Import `@papercusp/cart-drawer/styles.css` and set the `--cd-*` custom
properties (they fall back to shadcn/Tailwind-v4-style `--color-*` vars):
`--cd-foreground`, `--cd-muted-foreground`, `--cd-primary`,
`--cd-primary-foreground`, `--cd-border`, `--cd-card`, `--cd-background`,
`--cd-destructive`, `--cd-muted-bg`, `--cd-drawer-width`. No component here
hardcodes a color.

## Test

From a consumer workspace root: `npm run test -w @papercusp/cart-drawer`.
