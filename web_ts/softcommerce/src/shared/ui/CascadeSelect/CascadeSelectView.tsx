// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JComboBox } from 'jona-ui';
import { CASCADESELECT_DEFAULTS, type InterCascadeSelect } from './InterCascadeSelect';

type CascadeSelectViewProps = InterCascadeSelect & typeof CASCADESELECT_DEFAULTS;

export function CascadeSelectView({ levels, placeholder, loadErrorMessage, retryLabel, onChange, onRetry, registerField }: CascadeSelectViewProps) {
  return (
    <>
      {levels.map((level) => (
        <div key={level.name}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>{level.label}</span>
            <JComboBox
              ref={registerField?.(level.name)}
              placeholder={placeholder}
              value={level.value}
              options={level.options.map((o) => ({ value: o.id, label: o.name }))}
              disabled={level.disabled}
              aria-describedby={level.loadFailed ? `${level.name}-load-error` : undefined}
              hasError={Boolean(level.error)}
              onChange={(value) => onChange(level.name, value)}
            />
          </label>
          {level.loadFailed && (
            <JAlert id={`${level.name}-load-error`} variant="danger" role="alert">
              <span>{loadErrorMessage}</span>
              <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={() => onRetry(level.name)}>
                {retryLabel}
              </JButton>
            </JAlert>
          )}
          {level.error && <small role="alert">{level.error}</small>}
        </div>
      ))}
    </>
  );
}
