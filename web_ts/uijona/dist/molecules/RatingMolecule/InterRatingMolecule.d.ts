export interface InterRatingMolecule {
    value?: number;
    max?: number;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onChange?: (value: number) => void;
    onHover?: (value: number | null) => void;
}
export declare const RATING_MOLECULE_DEFAULTS: Required<Pick<InterRatingMolecule, 'max' | 'readOnly' | 'size' | 'value'>>;
