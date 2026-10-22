/** Tab workspace of the shell as a pure reducer. One tab per form id. */

export interface WorkspaceTab {
  formId: string;
  title: string;
}

export interface WorkspaceState {
  tabs: WorkspaceTab[];
  /** `formId` of the selected tab, `null` when the workspace is empty. */
  activeId: string | null;
}

export type WorkspaceAction =
  | { type: 'open'; formId: string; title: string }
  | { type: 'select'; formId: string }
  | { type: 'close'; formId: string };

export const EMPTY_WORKSPACE: WorkspaceState = { tabs: [], activeId: null };

const hasTab = (state: WorkspaceState, formId: string) => state.tabs.some((tab) => tab.formId === formId);

/** `open` re-selects a form that is already open; `close` activates the neighbor that takes the closed tab's place. */
export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'open':
      return hasTab(state, action.formId)
        ? { ...state, activeId: action.formId }
        : { tabs: [...state.tabs, { formId: action.formId, title: action.title }], activeId: action.formId };
    case 'select':
      return hasTab(state, action.formId) ? { ...state, activeId: action.formId } : state;
    case 'close': {
      const index = state.tabs.findIndex((tab) => tab.formId === action.formId);
      if (index === -1) return state;
      const tabs = state.tabs.filter((tab) => tab.formId !== action.formId);
      if (state.activeId !== action.formId) return { ...state, tabs };
      // The next tab slides into `index`; closing the last one falls back to the previous.
      const neighbor = tabs[index] ?? tabs[index - 1];
      return { tabs, activeId: neighbor?.formId ?? null };
    }
  }
}
