import React from 'react';
import { InterRatingAtom } from './InterRatingAtom';
interface RatingAtomViewProps extends Required<Pick<InterRatingAtom, 'value' | 'max' | 'readOnly' | 'size'>> {
    hovered: number | null;
    className?: string;
    onStarClick: (star: number) => void;
    onStarEnter: (star: number) => void;
    onStarLeave: () => void;
}
export declare const RatingAtomView: React.FC<RatingAtomViewProps>;
export {};
