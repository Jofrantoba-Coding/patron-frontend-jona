import React from 'react';
export interface InterBreadcrumbMolecule extends React.HTMLAttributes<HTMLElement> {
}
export interface InterBreadcrumbLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    onNavigate?: () => void;
}
