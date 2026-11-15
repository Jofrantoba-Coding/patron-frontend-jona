// Fixture: una molécula con estado en sus DEFAULTS.
export interface InterJSelect {
  label: string;
  value?: string;
  open?: boolean;
}

export const JSELECT_DEFAULTS = {
  value: '',
  open: false,
} as const;
