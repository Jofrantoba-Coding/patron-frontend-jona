import React from 'react';
import { InterRatingMolecule } from './InterRatingMolecule';
interface RatingMoleculeViewProps extends Required<Pick<InterRatingMolecule, 'value' | 'max' | 'readOnly' | 'size'>> {
    hovered: number | null;
    className?: string;
    onStarClick: (star: number) => void;
    onStarEnter: (star: number) => void;
    onStarLeave: () => void;
}
export declare const RatingMoleculeView: React.FC<RatingMoleculeViewProps>;
export {};
