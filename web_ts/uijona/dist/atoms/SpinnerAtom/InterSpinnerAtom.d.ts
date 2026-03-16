export type SpinnerSize = 'sm' | 'md' | 'lg';
export interface InterSpinnerAtom {
    size?: SpinnerSize;
    className?: string;
}
export declare const SPINNER_ATOM_DEFAULTS: Required<Pick<InterSpinnerAtom, 'size'>>;
