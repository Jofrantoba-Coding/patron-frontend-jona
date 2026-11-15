import { FG, FOCUS_RING, LINE_STRONG, PRIMARY, SURFACE, clases } from '../../tema/clasesToken.js';
import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton.js';

const VARIANTES = {
  primary: [PRIMARY],
  secondary: [SURFACE, FG, LINE_STRONG],
} as const;

/** Vista: render puro, y solo con clases de token. */
export function JButtonView({
  children, id, disabled, onClick,
  variant = JBUTTON_DEFAULTS.variant,
  type = JBUTTON_DEFAULTS.type,
  'aria-label': ariaLabel,
}: InterJButton) {
  return (
    <button
      id={id}
      type={type}
      data-variant={variant}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={clases(...VARIANTES[variant], FOCUS_RING)}
    >
      {children}
    </button>
  );
}
