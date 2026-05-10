export interface InterRatingAtom {
    value?: number;
    max?: number;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onChange?: (value: number) => void;
    onHover?: (value: number | null) => void;
}
export declare const RATING_ATOM_DEFAULTS: Required<Pick<InterRatingAtom, 'max' | 'readOnly' | 'size' | 'value'>>;
