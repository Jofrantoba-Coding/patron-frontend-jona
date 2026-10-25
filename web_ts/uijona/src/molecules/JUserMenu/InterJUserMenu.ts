// InterJUserMenu.ts — JONA Interface

export interface JUserMenuAction {
  kind: 'action';
  id: string;
  label: string;
  tone?: 'default' | 'danger';
  /** aria-disabled: the item stays focusable and does nothing. */
  disabled?: boolean;
}

export interface JUserMenuRadio {
  kind: 'radio';
  id: string;
  /** The group label, for example `Tema`. */
  label: string;
  /** The checked option value (controlled). */
  value: string;
  options: { value: string; label: string }[];
}

export type JUserMenuItem = JUserMenuAction | JUserMenuRadio;

export interface InterJUserMenu {
  /** The user name: the button's name and the menu header. */
  name: string;
  subtitle?: string;
  avatarSrc?: string;
  items: JUserMenuItem[];
  /** Observer events — value-first. */
  onAction: (id: string) => void;
  onRadioChange?: (value: string, id: string) => void;
}

/** The user menu has no optional prop with a default; labels come from the host. */
export const JUSERMENU_DEFAULTS = {} as const;
