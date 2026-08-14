import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { CartAnimationRect } from './events';

export interface FlyGhost {
  id: number;
  imageUrl?: string | null;
  label?: string;
  style: CSSProperties;
}

export interface SpawnGhostDetail {
  sourceRect?: CartAnimationRect | null;
  imageUrl?: string | null;
  productTitle?: string;
}

/**
 * Style factory for the fly-to-rail animation: exposes from/to coordinates as
 * CSS custom properties consumed by the ghost keyframes. `varPrefix` lets a
 * consumer keep pre-existing keyframes (Restart uses '--cart-fly').
 */
export function createGhostStyle(
  sourceRect: CartAnimationRect,
  destinationRect: DOMRect,
  varPrefix = '--cd-fly',
): CSSProperties {
  const fromX = sourceRect.left + sourceRect.width / 2 - 32;
  const fromY = sourceRect.top + sourceRect.height / 2 - 32;
  const toX = destinationRect.left + destinationRect.width / 2 - 32;
  const toY = destinationRect.top + destinationRect.height / 2 - 32;
  return {
    [`${varPrefix}-from-x`]: `${fromX}px`,
    [`${varPrefix}-from-y`]: `${fromY}px`,
    [`${varPrefix}-to-x`]: `${toX}px`,
    [`${varPrefix}-to-y`]: `${toY}px`,
  } as CSSProperties;
}

/**
 * "Item flies into the rail" ghosts. Tracks prefers-reduced-motion (no ghosts
 * when reduced), computes the destination from `targetRef` (the rail/trigger),
 * and expires each ghost after `ttlMs`.
 */
export function useFlyGhosts(targetRef: RefObject<HTMLElement | null>, { ttlMs = 850, varPrefix = '--cd-fly' } = {}) {
  const [ghosts, setGhosts] = useState<FlyGhost[]>([]);
  const idRef = useRef(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mediaQuery.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
    };
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  const spawn = useCallback(
    (detail: SpawnGhostDetail) => {
      if (reduceMotionRef.current) return;
      const sourceRect = detail.sourceRect;
      const target = targetRef.current;
      if (!sourceRect || !target) return;
      const destinationRect = target.getBoundingClientRect();
      const id = ++idRef.current;
      setGhosts((current) => [
        ...current,
        {
          id,
          imageUrl: detail.imageUrl,
          label: detail.productTitle,
          style: createGhostStyle(sourceRect, destinationRect, varPrefix),
        },
      ]);
      window.setTimeout(() => {
        setGhosts((current) => current.filter((ghost) => ghost.id !== id));
      }, ttlMs);
    },
    [targetRef, ttlMs, varPrefix],
  );

  return { ghosts, spawn };
}

export interface FlyGhostLayerProps {
  ghosts: FlyGhost[];
  /** Resolve the ghost image src (app applies its CDN sizing). */
  resolveImageSrc?: (url: string) => string;
  /** Fallback label content when a ghost has no image. */
  renderFallback?: (ghost: FlyGhost) => ReactNode;
  className?: string;
  ghostClassName?: string;
}

/** Fixed overlay that renders the in-flight ghosts. */
export function FlyGhostLayer({ ghosts, resolveImageSrc, renderFallback, className, ghostClassName }: FlyGhostLayerProps) {
  return (
    <div className={className ?? 'cd-overlay-root'} aria-hidden="true">
      {ghosts.map((ghost) => (
        <div key={ghost.id} className={ghostClassName ?? 'cd-fly-ghost'} style={ghost.style}>
          {ghost.imageUrl ? (
            <img src={resolveImageSrc ? resolveImageSrc(ghost.imageUrl) : ghost.imageUrl} alt="" className="cd-fly-img" />
          ) : (
            <div className="cd-fly-fallback">{renderFallback ? renderFallback(ghost) : ghost.label}</div>
          )}
        </div>
      ))}
    </div>
  );
}
