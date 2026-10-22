// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JComboBox } from 'jona-ui';
import { CASCADESELECT_DEFAULTS, type InterCascadeSelect } from './InterCascadeSelect';

type CascadeSelectViewProps = InterCascadeSelect & typeof CASCADESELECT_DEFAULTS;

export function CascadeSelectView({ levels, placeholder, onChange, registerField }: CascadeSelectViewProps) {
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
              hasError={Boolean(level.error)}
              onChange={(value) => onChange(level.name, value)}
            />
          </label>
          {level.error && <small role="alert">{level.error}</small>}
        </div>
      ))}
    </>
  );
}
