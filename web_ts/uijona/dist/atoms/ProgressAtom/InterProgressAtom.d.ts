export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';
export interface InterProgressAtom {
    value?: number;
    max?: number;
    variant?: ProgressVariant;
    showLabel?: boolean;
    className?: string;
}
export declare const PROGRESS_ATOM_DEFAULTS: Required<Pick<InterProgressAtom, 'value' | 'max' | 'variant' | 'showLabel'>>;
