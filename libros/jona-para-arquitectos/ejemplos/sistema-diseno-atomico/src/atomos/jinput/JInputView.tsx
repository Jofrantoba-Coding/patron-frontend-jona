import { FG, FOCUS_RING, LINE_STRONG, SURFACE, clases } from '../../tema/clasesToken.js';
import { JINPUT_DEFAULTS, type InterJInput } from './InterJInput.js';

/** Vista: render puro, y solo con clases de token. */
export function JInputView({
  value, onChange, id, name, placeholder, invalid, describedBy, autoComplete,
  type = JINPUT_DEFAULTS.type,
  disabled = JINPUT_DEFAULTS.disabled,
  required = JINPUT_DEFAULTS.required,
  'aria-label': ariaLabel,
}: InterJInput) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-label={ariaLabel}
      onChange={(event) => onChange?.(event.target.value)}
      className={clases(SURFACE, FG, LINE_STRONG, FOCUS_RING)}
    />
  );
}
