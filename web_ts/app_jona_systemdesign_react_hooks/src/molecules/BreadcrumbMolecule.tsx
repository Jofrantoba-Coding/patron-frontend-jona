// BreadcrumbMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Breadcrumb — composable with custom separator + ellipsis.
import React from 'react';
import { cn } from '../lib/cn';

// ── Root ──────────────────────────────────────────────────────────────────────

export const BreadcrumbMolecule: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => (
  <nav aria-label="breadcrumb" className={cn('flex', className)} {...props} />
);

// ── List ──────────────────────────────────────────────────────────────────────

export const BreadcrumbList: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = ({
  className,
  ...props
}) => (
  <ol
    className={cn(
      'flex flex-wrap items-center gap-1.5 text-sm text-neutral-500',
      className
    )}
    {...props}
  />
);

// ── Item ──────────────────────────────────────────────────────────────────────

export const BreadcrumbItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({
  className,
  ...props
}) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);

// ── Link (clickable crumb) ────────────────────────────────────────────────────

interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render as a custom component (e.g. react-router Link) */
  asChild?: boolean;
  onNavigate?: () => void;
}

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  className,
  onNavigate,
  onClick,
  children,
  href,
  ...props
}) => (
  <a
    href={href ?? '#'}
    onClick={(e) => {
      if (onNavigate) { e.preventDefault(); onNavigate(); }
      onClick?.(e);
    }}
    className={cn(
      'transition-colors hover:text-neutral-900 cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </a>
);

// ── Current page (non-clickable) ──────────────────────────────────────────────

export const BreadcrumbPage: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    role="link"
    aria-current="page"
    aria-disabled="true"
    className={cn('font-medium text-neutral-900', className)}
    {...props}
  />
);

// ── Separator ─────────────────────────────────────────────────────────────────

export const BreadcrumbSeparator: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({
  className,
  children,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-neutral-400 select-none', className)}
    {...props}
  >
    {children ?? (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </li>
);

// ── Ellipsis (collapsed crumbs) ───────────────────────────────────────────────

export const BreadcrumbEllipsis: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-5 w-5 items-center justify-center text-neutral-400', className)}
    {...props}
  >
    ···
  </span>
);
