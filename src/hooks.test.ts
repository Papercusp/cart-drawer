// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZeroedLines, useDraftQuantities } from './hooks';

describe('useZeroedLines', () => {
  it('marks/unmarks ids and bumps a reactive counter', () => {
    const { result } = renderHook(() => useZeroedLines());
    expect(result.current.ids.size).toBe(0);
    const bump0 = result.current.bump;
    act(() => result.current.mark('a'));
    expect(result.current.ids.has('a')).toBe(true);
    expect(result.current.bump).not.toBe(bump0);
    act(() => result.current.unmark('a'));
    expect(result.current.ids.has('a')).toBe(false);
  });
});

describe('useDraftQuantities', () => {
  it('stores drafts and commit parses + clears', () => {
    const { result } = renderHook(() => useDraftQuantities());
    act(() => result.current.setDraft('a', '7'));
    expect(result.current.drafts['a']).toBe('7');
    let committed: number | null = null;
    act(() => {
      committed = result.current.commit('a');
    });
    expect(committed).toBe(7);
    expect(result.current.drafts['a']).toBeUndefined();
  });

  it('commit returns null for missing or invalid drafts', () => {
    const { result } = renderHook(() => useDraftQuantities());
    let out: number | null = 0;
    act(() => {
      out = result.current.commit('missing');
    });
    expect(out).toBeNull();
    act(() => result.current.setDraft('a', 'not-a-number'));
    act(() => {
      out = result.current.commit('a');
    });
    expect(out).toBeNull();
    act(() => result.current.setDraft('b', '-3'));
    act(() => {
      out = result.current.commit('b');
    });
    expect(out).toBeNull();
  });
});
