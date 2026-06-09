import React from 'react';
import { InterJRating } from './InterJRating';
export interface JRatingViewProps {
    value: number;
    max: number;
    readOnly: boolean;
    size: NonNullable<InterJRating['size']>;
    hovered: number | null;
    className?: string;
    onStarClick: (star: number) => void;
    onStarEnter: (star: number) => void;
    onStarLeave: () => void;
}
export declare const JRatingView: React.FC<JRatingViewProps>;
