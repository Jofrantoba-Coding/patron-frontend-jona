import React from 'react';
export interface HeroDynamicCTA {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline';
}
export interface InterJHeroDynamic extends React.HTMLAttributes<HTMLElement> {
    eyebrow?: string;
    /** Parte fija del titular, p.ej. "Construimos". */
    titlePrefix: string;
    /** Palabras/verticales que rotan tras el prefijo. */
    rotatingWords: string[];
    subtitle?: string;
    ctas?: HeroDynamicCTA[];
    visual?: React.ReactNode;
    /** Milisegundos entre rotaciones. */
    intervalMs?: number;
}
export declare const JHERO_DYNAMIC_DEFAULTS: {
    readonly intervalMs: 2200;
};
