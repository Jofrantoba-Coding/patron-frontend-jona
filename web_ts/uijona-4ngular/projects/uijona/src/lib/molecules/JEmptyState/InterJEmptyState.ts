export interface JEmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

/** Contrato publico de JEmptyState. El icono se proyecta con [jIcon]. */
export interface InterJEmptyState {
  title: string;
  description?: string;
  actions?: JEmptyStateAction[];
}
