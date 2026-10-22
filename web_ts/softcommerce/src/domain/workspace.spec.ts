import { describe, expect, it } from 'vitest';
import { EMPTY_WORKSPACE, workspaceReducer, type WorkspaceState } from './workspace';

const tab = (formId: string) => ({ formId, title: `Title ${formId}` });
const state = (ids: string[], activeId: string | null): WorkspaceState => ({ tabs: ids.map(tab), activeId });
const ids = (s: WorkspaceState) => s.tabs.map((t) => t.formId);

describe('workspaceReducer open', () => {
  it('appends a new tab and selects it', () => {
    const next = workspaceReducer(state(['a'], 'a'), { type: 'open', formId: 'b', title: 'Title b' });

    expect(ids(next)).toEqual(['a', 'b']);
    expect(next.activeId).toBe('b');
    expect(next.tabs[1]).toEqual({ formId: 'b', title: 'Title b' });
  });

  it('opens the first tab of an empty workspace', () => {
    const next = workspaceReducer(EMPTY_WORKSPACE, { type: 'open', formId: 'a', title: 'Title a' });

    expect(ids(next)).toEqual(['a']);
    expect(next.activeId).toBe('a');
  });

  it('re-selects an already open form without duplicating it', () => {
    const next = workspaceReducer(state(['a', 'b'], 'b'), { type: 'open', formId: 'a', title: 'Other title' });

    expect(ids(next)).toEqual(['a', 'b']);
    expect(next.activeId).toBe('a');
    expect(next.tabs[0].title).toBe('Title a');
  });
});

describe('workspaceReducer select', () => {
  it('activates an open tab', () => {
    expect(workspaceReducer(state(['a', 'b'], 'a'), { type: 'select', formId: 'b' }).activeId).toBe('b');
  });

  it('ignores an unknown tab', () => {
    const current = state(['a', 'b'], 'a');

    expect(workspaceReducer(current, { type: 'select', formId: 'zzz' })).toBe(current);
  });
});

describe('workspaceReducer close', () => {
  it('S-SHELL-12 closing the active middle tab activates an adjacent one', () => {
    const next = workspaceReducer(state(['a', 'b', 'c'], 'b'), { type: 'close', formId: 'b' });

    expect(ids(next)).toEqual(['a', 'c']);
    expect(next.activeId).toBe('c');
  });

  it('closing the active last tab activates the previous one', () => {
    const next = workspaceReducer(state(['a', 'b', 'c'], 'c'), { type: 'close', formId: 'c' });

    expect(ids(next)).toEqual(['a', 'b']);
    expect(next.activeId).toBe('b');
  });

  it('closing the active first tab activates the one that takes its place', () => {
    const next = workspaceReducer(state(['a', 'b', 'c'], 'a'), { type: 'close', formId: 'a' });

    expect(ids(next)).toEqual(['b', 'c']);
    expect(next.activeId).toBe('b');
  });

  it('closing an inactive tab keeps the active one', () => {
    const next = workspaceReducer(state(['a', 'b', 'c'], 'c'), { type: 'close', formId: 'a' });

    expect(ids(next)).toEqual(['b', 'c']);
    expect(next.activeId).toBe('c');
  });

  it('closing the last remaining tab gives an empty workspace', () => {
    const next = workspaceReducer(state(['a'], 'a'), { type: 'close', formId: 'a' });

    expect(next).toEqual({ tabs: [], activeId: null });
  });

  it('closing an unknown tab changes nothing', () => {
    const current = state(['a', 'b'], 'a');

    expect(workspaceReducer(current, { type: 'close', formId: 'zzz' })).toBe(current);
  });

  it('S-SHELL-14 a closed form opens again as a fresh tab', () => {
    const closed = workspaceReducer(state(['a', 'b'], 'a'), { type: 'close', formId: 'a' });
    const reopened = workspaceReducer(closed, { type: 'open', formId: 'a', title: 'Title a' });

    expect(ids(reopened)).toEqual(['b', 'a']);
    expect(reopened.activeId).toBe('a');
  });
});
