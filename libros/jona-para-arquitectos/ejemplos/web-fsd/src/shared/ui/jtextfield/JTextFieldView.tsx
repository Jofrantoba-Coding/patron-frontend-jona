import { JTEXTFIELD_DEFAULTS, type InterJTextField } from './InterJTextField';

/** Vista: render puro. Repite los DEFAULTS para que un `undefined` explícito resuelva al valor por defecto. */
export function JTextFieldView({
  label, value, onChange,
  type = JTEXTFIELD_DEFAULTS.type,
  disabled = JTEXTFIELD_DEFAULTS.disabled,
}: InterJTextField) {
  return (
    <input
      aria-label={label}
      type={type}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      style={{ display: 'block', margin: '6px 0', padding: '6px 8px' }}
    />
  );
}
