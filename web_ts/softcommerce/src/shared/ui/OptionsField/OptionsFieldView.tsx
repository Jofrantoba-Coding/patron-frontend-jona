// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JComboBox, JRadioButton } from 'jona-ui';
import { forwardRef, type ForwardedRef } from 'react';
import type { OptionsFieldViewProps } from './OptionsFieldImpl';

const assign = (ref: ForwardedRef<HTMLElement>, element: HTMLElement | null) => {
  if (typeof ref === 'function') ref(element);
  else if (ref) ref.current = element;
};

export const OptionsFieldView = forwardRef<HTMLElement, OptionsFieldViewProps>(
  ({ name, label, options, display, value, readOnly, hasError, placeholder, onValueChange }, ref) =>
    display === 'radio' ? (
      // Each radio label is a 44px hit box below sm: (jona-ui); the first radio takes the focus of a blocked submit.
      <fieldset className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0" disabled={readOnly}>
        <legend className="text-sm">{label}</legend>
        <div role="radiogroup" aria-label={label} aria-invalid={hasError || undefined} className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-4">
          {options.map((option, index) => (
            <JRadioButton
              key={option.value}
              ref={index === 0 ? (element) => assign(ref, element) : undefined}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={option.label}
              checked={value === option.value}
              disabled={readOnly}
              hasError={hasError}
              onCheckedChange={(checked) => checked && onValueChange(option.value)}
            />
          ))}
        </div>
      </fieldset>
    ) : (
      <label style={{ display: 'grid', gap: 4 }}>
        <span>{label}</span>
        <JComboBox
          ref={(element) => assign(ref, element)}
          placeholder={placeholder}
          value={value}
          options={options.map((option) => ({ value: option.value, label: option.label }))}
          disabled={readOnly}
          hasError={hasError}
          onChange={(next) => onValueChange(next)}
        />
      </label>
    ),
);
OptionsFieldView.displayName = 'OptionsFieldView';
