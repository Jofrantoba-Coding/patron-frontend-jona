// Pure: the client rules a `deferred` row action names (R-ACT-4, D12). A rule decides what the action does to the pending rows of the open register.

/** What a rule sees: the rows of the grid (without the deleted ones), the selected row, if any, and the input of the action dialog. */
export interface ActionCall {
  rows: Record<string, any>[];
  selected?: Record<string, any>;
  input: Record<string, any>;
}

/** What a rule does: add a pending row, change the selected one (the fields and the new state), and set values of the parent form (a derived `estado`, R-ACT-5). */
export interface ActionEffect {
  insert?: Record<string, unknown>;
  change?: { patch?: Record<string, unknown>; estado?: string };
  parent?: Record<string, string>;
}

export interface ActionRule {
  /** The message that refuses the action (it shows in the grid, or in the action dialog), or nothing when it may go on. */
  guard?: (call: ActionCall) => string | undefined;
  apply: (call: ActionCall) => ActionEffect;
}

/** The rules by the name an action declares in `rule`. Empty until a slice registers one (W3-7 `activacion`). */
export const ACTION_RULES: Record<string, ActionRule> = {};
