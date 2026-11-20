import { JInput } from '../../atomos/jinput/index.js';
import { JText } from '../../atomos/jtext/index.js';
import { FG, STACK } from '../../tema/clasesToken.js';
import { JFIELD_DEFAULTS, type InterJFieldVista } from './InterJField.js';

/** Vista: compone los átomos JInput y JText; render puro. */
export function JFieldView({
  label, value, onChange, hint, error, inputId, hintId, errorId, autoComplete,
  type = JFIELD_DEFAULTS.type,
  required = JFIELD_DEFAULTS.required,
  disabled = JFIELD_DEFAULTS.disabled,
}: InterJFieldVista) {
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={STACK}>
      <label htmlFor={inputId} className={FG}>
        {label}
      </label>
      <JInput
        id={inputId}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        invalid={Boolean(error)}
        describedBy={describedBy}
      />
      {hint && <JText id={hintId} tone="muted" as="span">{hint}</JText>}
      {error && <JText id={errorId} tone="danger" as="span" role="alert">{error}</JText>}
    </div>
  );
}
