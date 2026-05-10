// MultiSelectMoleculeImpl.tsx — JONA Implementation
import React, { useEffect, useRef, useState } from 'react';
import { InterMultiSelectMolecule, MultiSelectOption, MULTI_SELECT_MOLECULE_DEFAULTS } from './InterMultiSelectMolecule';
import { MultiSelectMoleculeView } from './MultiSelectMoleculeView';

export const MultiSelectMoleculeImpl: React.FC<InterMultiSelectMolecule> = (props) => {
  const merged = { ...MULTI_SELECT_MOLECULE_DEFAULTS, ...props };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [listStyle, setListStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const listRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const currentValues = props.value ?? merged.value;
  const selected = props.options.filter((o) => currentValues.includes(o.value));
  const filtered = props.options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setListStyle({ position: 'fixed', top: r.bottom + 4, left: r.left, width: r.width, zIndex: 50 });
  };

  const openList = () => { updatePosition(); setOpen(true); setQuery(''); setTimeout(() => inputRef.current?.focus(), 0); };
  const closeList = () => { setOpen(false); setQuery(''); };

  const handleToggle = (opt: MultiSelectOption) => {
    if (opt.disabled) return;
    const next = currentValues.includes(opt.value)
      ? currentValues.filter((v) => v !== opt.value)
      : [...currentValues, opt.value];
    const nextOpts = props.options.filter((o) => next.includes(o.value));
    props.onChange?.(next, nextOpts);
  };

  const handleRemove = (value: string) => {
    const next = currentValues.filter((v) => v !== value);
    const nextOpts = props.options.filter((o) => next.includes(o.value));
    props.onChange?.(next, nextOpts);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { closeList(); }
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node)) closeList();
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  return (
    <MultiSelectMoleculeView
      selected={selected}
      filtered={filtered}
      query={query}
      open={open}
      disabled={merged.disabled}
      placeholder={merged.placeholder}
      searchPlaceholder={merged.searchPlaceholder}
      emptyText={merged.emptyText}
      maxSelected={props.maxSelected}
      className={props.className}
      listStyle={listStyle}
      triggerRef={triggerRef}
      inputRef={inputRef}
      listRef={listRef}
      onTriggerClick={() => (open ? closeList() : openList())}
      onQueryChange={setQuery}
      onToggle={handleToggle}
      onRemove={handleRemove}
      onInputKeyDown={handleInputKeyDown}
    />
  );
};

MultiSelectMoleculeImpl.displayName = 'MultiSelectMolecule';
