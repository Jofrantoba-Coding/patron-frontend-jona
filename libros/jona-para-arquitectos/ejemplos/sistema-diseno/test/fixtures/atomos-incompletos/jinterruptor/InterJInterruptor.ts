// Fixture: una unidad sin Vista ni índice y con estado en sus DEFAULTS.
export interface InterJInterruptor {
  label: string;
  checked?: boolean;
  selectedLabel?: string;
  size?: 'sm' | 'md';
}

export const JINTERRUPTOR_DEFAULTS = {
  checked: false,
  selectedLabel: 'Activado',
  size: 'md',
} as const;
