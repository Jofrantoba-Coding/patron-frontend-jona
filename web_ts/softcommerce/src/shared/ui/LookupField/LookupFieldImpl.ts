// Layer: Impl. The typed code resolves on blur against the ACTIVE records; a miss opens the dialog (R-LKP-6).
import { useEffect, useRef, useState } from 'react';
import { padTypedCode } from '../../../domain/crud/lookupCode';
import { LOOKUPFIELD_DEFAULTS, type InterLookupField } from './InterLookupField';

type Row = Record<string, string>;

export type LookupFieldViewProps = typeof LOOKUPFIELD_DEFAULTS &
  Pick<InterLookupField, 'name' | 'label' | 'description' | 'dialog'> & {
    text: string;
    open: boolean;
    onTextChange: (text: string) => void;
    onBlur: () => void;
    onSearch: () => void;
    onClear: () => void;
    onPick: (row: Row) => void;
    onClose: () => void;
  };

export function useLookupFieldImpl(props: InterLookupField): LookupFieldViewProps {
  const { name, label, value, description, dialog, describe, onChange } = props;
  const resolved = { ...LOOKUPFIELD_DEFAULTS, ...props };
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const typing = useRef(false);
  // A pick, a clear or a loaded record changes the value from outside; the box then shows it.
  useEffect(() => {
    if (!typing.current) setText(value);
    typing.current = false;
  }, [value]);

  const pick = (row: Row) => {
    const id = String(row[dialog.idKey]);
    setText(id);
    onChange(id, describe(row));
  };
  const resolve = async () => {
    const code = padTypedCode(text, resolved.codeWidth);
    if (code === '' || code === value) return;
    setText(code);
    try {
      const { items } = await dialog.list({ filters: { [dialog.idKey]: code }, page: 1, pageSize: 10 });
      const hit = items.find((row) => String(row[dialog.idKey]) === code);
      if (hit) pick(hit);
      else setOpen(true);
    } catch {
      setOpen(true);
    }
  };

  return {
    ...LOOKUPFIELD_DEFAULTS, name, label, description: value === '' ? '' : description, dialog, text, open,
    codeWidth: resolved.codeWidth, readOnly: resolved.readOnly, hasError: resolved.hasError,
    onTextChange: (next) => {
      if (resolved.readOnly) return;
      setText(next);
      // Editing the code drops the picked record: the description goes with it (S-LKP-11).
      if (value !== '') {
        typing.current = true;
        onChange('', '');
      }
    },
    onBlur: () => void resolve(),
    onSearch: () => setOpen(true),
    onClear: () => {
      setText('');
      onChange('', '');
    },
    onPick: pick,
    onClose: () => setOpen(false),
  };
}
