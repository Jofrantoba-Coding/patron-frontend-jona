// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JButton } from 'jona-ui';
import { forwardRef } from 'react';
import { LookupDialog } from '../LookupDialog';
import { UppercaseTextField } from '../UppercaseTextField';
import type { LookupFieldViewProps } from './LookupFieldImpl';

export const LookupFieldView = forwardRef<HTMLInputElement, LookupFieldViewProps>(
  ({ name, label, text, description, readOnly, hasError, open, dialog, searchLabel, clearLabel, onTextChange, onBlur, onSearch, onClear, onPick, onClose }, ref) => (
    <div>
      <div className="grid gap-2 sm:grid-cols-[10rem_1fr_auto_auto] sm:items-end">
        <label style={{ display: 'grid', gap: 4 }}>
          <span>{label}</span>
          <UppercaseTextField ref={ref} name={name} value={text} readOnly={readOnly} hasError={hasError} className="min-h-11 sm:min-h-9" onBlur={onBlur} onChange={onTextChange} />
        </label>
        <UppercaseTextField aria-label={`${label} descripción`} value={description} readOnly className="min-h-11 sm:min-h-9" onChange={() => undefined} />
        {!readOnly && (
          <>
            <JButton variant="outline" aria-label={searchLabel} className="min-h-11 sm:min-h-9" onClick={onSearch}>…</JButton>
            <JButton variant="outline" aria-label={clearLabel} className="min-h-11 sm:min-h-9" onClick={onClear}>×</JButton>
          </>
        )}
      </div>
      {open && <LookupDialog {...dialog} onPick={onPick} onClose={onClose} />}
    </div>
  ),
);
LookupFieldView.displayName = 'LookupFieldView';
