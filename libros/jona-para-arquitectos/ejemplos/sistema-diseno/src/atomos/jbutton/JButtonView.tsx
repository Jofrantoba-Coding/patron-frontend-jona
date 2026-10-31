import { FG, FOCUS_RING, LINE_STRONG, PRIMARY, SURFACE } from '../../tema/clasesToken';
import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton';

const VARIANT_CLASSES = {
  primary: [PRIMARY],
  secondary: [SURFACE, FG, LINE_STRONG],
} as const;

/** Vista: render puro, y solo con clases de token semántico. */
export function JButtonView({
  children, icon, disabled, onClick,
  variant = JBUTTON_DEFAULTS.variant,
  type = JBUTTON_DEFAULTS.type,
  ...aria
}: InterJButton) {
  return (
    <button
      {...aria}
      type={type}
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={[...VARIANT_CLASSES[variant], FOCUS_RING].join(' ')}
    >
      {icon}
      {children}
    </button>
  );
}
