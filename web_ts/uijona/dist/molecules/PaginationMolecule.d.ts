import React from 'react';
import { InterEventsPaginationMolecule } from './events/InterEventsPaginationMolecule';
interface PaginationMoleculeProps extends InterEventsPaginationMolecule {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
    className?: string;
}
export declare const PaginationMolecule: React.FC<PaginationMoleculeProps>;
export {};
