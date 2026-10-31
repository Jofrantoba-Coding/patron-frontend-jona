import React from 'react';
import { cn } from '../../lib/cn';
import { JSpinner } from '../JSpinner';
import type { InterJButton, JButtonVariant, JButtonSize, JButtonDensity } from './InterJButton';
import { CONTROL_BORDER, CONTROL_H, FG, FOCUS_RING, HOVER_LINE_BG_STRONG, HOVER_OVERLAY, LINE_BG, ON_PRIMARY } from '../../theme/tokenClasses';

const variantClasses: Record<JButtonVariant, string> = {
  default:     `bg-primary-600 ${ON_PRIMARY} hover:bg-primary-700 focus-visible:ring-primary-500`,
  outline:     `border ${CONTROL_BORDER} bg-transparent ${FG} ${HOVER_OVERLAY} ${FOCUS_RING}`,
  ghost:       `bg-transparent ${FG} ${HOVER_OVERLAY} ${FOCUS_RING}`,
  destructive: `bg-danger-500 ${ON_PRIMARY} hover:bg-danger-600 focus-visible:ring-danger-500`,
  secondary:   `${LINE_BG} ${FG} ${HOVER_LINE_BG_STRONG} ${FOCUS_RING}`,
  link:        'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500',
  accent:      `bg-accent-600 ${ON_PRIMARY} hover:bg-accent-700 focus-visible:ring-accent-500`,
};

// Posición del icono vía Tailwind (no depende del CSS embarcado)
const iconPositionClasses: Record<'left' | 'right' | 'top' | 'bottom', string> = {
  left:   'flex-row',
  right:  'flex-row-reverse',
  top:    'flex-col',
  bottom: 'flex-col-reverse',
};

// md/default/icon: 44px touch target below sm:, desktop density from sm: up.
// min-* (not h-*/w-*) so the floor survives a caller's h-*/w-* through twMerge.
const sizeClasses: Record<JButtonSize, string> = {
  xs:      'min-h-6 px-2 py-0.5 text-xs rounded',
  sm:      'min-h-7 px-3 py-1 text-xs rounded-md',
  md:      'min-h-11 sm:min-h-9 px-4 py-2 text-sm rounded-md',
  default: 'min-h-11 sm:min-h-9 px-4 py-2 text-sm rounded-md',
  lg:      'min-h-11 px-6 py-2 text-base rounded-md',
  xl:      'min-h-14 px-8 py-3 text-lg rounded-lg',
  icon:    'h-9 w-9 min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 p-0 rounded-md',
};

// Both breakpoints are set so the density replaces the size's height through twMerge (D8).
const densityClasses: Record<JButtonDensity, string> = {
  touch:   'min-h-11 sm:min-h-11',
  compact: 'min-h-9 sm:min-h-9',
  auto:    CONTROL_H, // follows --jona-control-h, so an ancestor [data-jona-density] changes it
};

interface JButtonViewProps extends InterJButton {
  forwardedRef?: React.Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export const JButtonView: React.FC<JButtonViewProps> = ({
  variant = 'default',
  size = 'md',
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  density,
  disabled,
  type = 'button',
  className,
  style,
  children,
  icon,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  href,
  target,
  rel,
  asChild = false,
  forwardedRef,
  ...rest
}) => {
  const activeIcon = loading ? <JSpinner size="sm" /> : icon;
  const hasIcon = Boolean(activeIcon);
  const isIconOnly = hasIcon && !children;

  const classes = cn(
    'jbutton',
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    density && densityClasses[density],
    hasIcon && iconPositionClasses[iconPosition],
    isIconOnly && 'gap-0',
    fullWidth && 'w-full',
    href && (disabled || loading) && 'pointer-events-none opacity-50',
    className
  );

  const inner = (
    <>
      {hasIcon && (
        <span className="jbutton-icon" aria-hidden={loading ? undefined : true}>
          {activeIcon}
        </span>
      )}
      {children && <span className="jbutton-text">{children}</span>}
    </>
  );

  // asChild: fusiona el estilo de botón sobre el único hijo (p.ej. <Link> de un router)
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
      'data-jbutton-full-width': fullWidth ? 'true' : undefined,
      ...rest,
    } as Record<string, unknown>);
  }

  // Con href se renderiza como <a> (link con estilo de botón)
  if (href) {
    return (
      <a
        ref={forwardedRef as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || loading || undefined}
        data-jbutton-icon-position={hasIcon ? iconPosition : undefined}
        data-jbutton-full-width={fullWidth ? 'true' : undefined}
        style={style}
        className={classes}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={forwardedRef}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      data-jbutton-icon-position={hasIcon ? iconPosition : undefined}
      data-jbutton-full-width={fullWidth ? 'true' : undefined}
      style={style}
      className={classes}
      {...rest}
    >
      {inner}
    </button>
  );
};
