import React from 'react';
export declare const BreadcrumbMolecule: React.FC<React.HTMLAttributes<HTMLElement>>;
export declare const BreadcrumbList: React.FC<React.OlHTMLAttributes<HTMLOListElement>>;
export declare const BreadcrumbItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>>;
interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    onNavigate?: () => void;
}
export declare const BreadcrumbLink: React.FC<BreadcrumbLinkProps>;
export declare const BreadcrumbPage: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
export declare const BreadcrumbSeparator: React.FC<React.HTMLAttributes<HTMLLIElement>>;
export declare const BreadcrumbEllipsis: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
export {};
