import React from 'react';
export interface InterJBreadcrumb extends React.HTMLAttributes<HTMLElement> {
}
export interface InterBreadcrumbLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    onNavigate?: () => void;
}
