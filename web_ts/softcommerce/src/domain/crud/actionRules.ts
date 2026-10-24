// Pure: the client rules a `deferred` row action names (R-ACT-4, D12). A rule decides what the action does to the pending rows of the open register.
import { ANEXO_RULES } from './anexoRules';
import { PADRON_RULES } from './padronRules';
import { SUSTITUTO_RULES } from './sustitutoRules';

/** What a rule sees: the rows of the grid (without the deleted ones), the selected row, if any, and the input of the action dialog. */
export interface ActionCall {
  rows: Record<string, any>[];
  selected?: Record<string, any>;
  input: Record<string, any>;
  /** The `params` the action declares (the entity word of the anexo messages). */
  params: Record<string, unknown>;
}

/** What a rule does: add a pending row, change the selected one (the fields and the new state), and set values of the parent form (a derived `estado`, R-ACT-5). */
export interface ActionEffect {
  insert?: Record<string, unknown>;
  change?: { patch?: Record<string, unknown>; estado?: string };
  /** The selected row is a pending one the register drops (a padron activated and deactivated before the save has nothing to persist). */
  remove?: true;
  parent?: Record<string, string>;
}

export interface ActionRule {
  /** Refuses BEFORE the action dialog opens: the message shows in the grid; an empty text refuses silently (nothing opens, nothing shows). */
  check?: (call: ActionCall) => string | undefined;
  /** The message that refuses the action when the dialog is confirmed (it shows in the action dialog, or in the grid when there is none), or nothing when it may go on. */
  guard?: (call: ActionCall) => string | undefined;
  apply: (call: ActionCall) => ActionEffect;
}

/** The rules by the name an action declares in `rule`: the anexo Activar and Desactivar (W3-7), the padron ones (W3-15) and the Cliente sustitutos ones (W3-17); tests register their own. */
export const ACTION_RULES: Record<string, ActionRule> = { ...ANEXO_RULES, ...PADRON_RULES, ...SUSTITUTO_RULES };
