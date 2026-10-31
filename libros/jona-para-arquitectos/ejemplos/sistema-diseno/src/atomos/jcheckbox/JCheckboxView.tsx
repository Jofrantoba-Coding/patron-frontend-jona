import { FG, FOCUS_RING } from '../../tema/clasesToken';
import { JCHECKBOX_DEFAULTS, type InterJCheckbox } from './InterJCheckbox';

/** Vista: render puro, y solo con clases de token semántico. */
export function JCheckboxView({
  label, checked, onChange,
  disabled = JCHECKBOX_DEFAULTS.disabled,
  'aria-describedby': describedBy,
}: InterJCheckbox) {
  return (
    <label className={FG}>
      <input
        type="checkbox"
        className={FOCUS_RING}
        checked={checked}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      {label}
    </label>
  );
}
