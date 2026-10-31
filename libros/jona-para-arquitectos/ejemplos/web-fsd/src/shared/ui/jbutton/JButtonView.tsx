import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton';

const PADDING = { sm: '2px 8px', md: '6px 14px', lg: '10px 20px' } as const;

/**
 * Vista: render puro. Repite los DEFAULTS en la desestructuración para que
 * un `undefined` explícito resuelva al valor por defecto.
 */
export function JButtonView({
  children, icon, disabled, onClick,
  variant = JBUTTON_DEFAULTS.variant,
  size = JBUTTON_DEFAULTS.size,
  iconPosition = JBUTTON_DEFAULTS.iconPosition,
  loading = JBUTTON_DEFAULTS.loading,
  fullWidth = JBUTTON_DEFAULTS.fullWidth,
  type = JBUTTON_DEFAULTS.type,
}: InterJButton) {
  return (
    <button
      type={type}
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      style={{
        padding: PADDING[size],
        width: fullWidth ? '100%' : undefined,
        border: variant === 'ghost' ? 'none' : '1px solid #1f4e79',
        background: variant === 'default' ? '#1f4e79' : 'transparent',
        color: variant === 'default' ? '#fff' : '#1f4e79',
      }}
    >
      {iconPosition === 'left' ? icon : null}
      {children}
      {iconPosition === 'right' ? icon : null}
    </button>
  );
}
