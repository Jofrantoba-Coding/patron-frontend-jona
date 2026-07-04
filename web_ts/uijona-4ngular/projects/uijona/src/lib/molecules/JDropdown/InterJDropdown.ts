export interface JDropdownItem {
  label: string;
  icon?: string;
  shortcut?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onClick?: () => void;
}

export interface JDropdownGroup {
  label?: string;
  items: JDropdownItem[];
}

/** Contrato publico de JDropdown. Slot `[jTrigger]` = disparador. */
export interface InterJDropdown {
  groups: JDropdownGroup[];
  align?: 'start' | 'end';
}
