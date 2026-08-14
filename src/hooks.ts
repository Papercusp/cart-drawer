import { useCallback, useRef, useState } from 'react';

/**
 * Locally "saved" (qty-0) line ids. The Set lives in a ref (stable identity);
 * `bump` makes dependent memos re-run when it mutates (refs aren't reactive).
 * Pair with applyZeroedMask(cart, zeroed.ids).
 */
export function useZeroedLines() {
  const idsRef = useRef<Set<string>>(new Set());
  const [bump, setBump] = useState(0);
  const rebump = useCallback(() => setBump((n) => n + 1), []);
  const mark = useCallback((id: string) => {
    idsRef.current.add(id);
    rebump();
  }, [rebump]);
  const unmark = useCallback((id: string) => {
    idsRef.current.delete(id);
    rebump();
  }, [rebump]);
  return { ids: idsRef.current, bump, mark, unmark };
}

/**
 * Draft quantity inputs, keyed by line id. `commit` clears the draft and
 * returns the parsed value — or null when there is no draft / it is invalid
 * (caller reverts). Mirrors Restart CartShell's draftQtys/commitQty semantics.
 */
export function useDraftQuantities() {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const setDraft = useCallback((id: string, raw: string) => {
    setDrafts((prev) => ({ ...prev, [id]: raw }));
  }, []);
  const clearDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);
  const commit = useCallback(
    (id: string): number | null => {
      const raw = drafts[id];
      if (raw === undefined) return null;
      clearDraft(id);
      const parsed = parseInt(raw, 10);
      if (isNaN(parsed) || parsed < 0) return null;
      return parsed;
    },
    [drafts, clearDraft],
  );
  return { drafts, setDraft, clearDraft, commit };
}

/**
 * Per-line transient alerts (e.g. "Only N available.") with auto-expiry.
 */
export function useLineAlerts(ttlMs = 4000) {
  const [alerts, setAlerts] = useState<Record<string, string>>({});
  const setAlert = useCallback((id: string, message: string) => {
    setAlerts((prev) => ({ ...prev, [id]: message }));
    setTimeout(
      () =>
        setAlerts((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        }),
      ttlMs,
    );
  }, [ttlMs]);
  return { alerts, setAlert };
}
