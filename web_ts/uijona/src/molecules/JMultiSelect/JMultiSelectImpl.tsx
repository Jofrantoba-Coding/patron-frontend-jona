// JMultiSelectImpl.tsx — JONA Implementation
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InterJMultiSelect, JMultiSelectOption, JMULTI_SELECT_DEFAULTS } from './InterJMultiSelect';
import { JMultiSelectView } from './JMultiSelectView';
import { computeFloatingPosition, floatingStyle } from '../../lib/floating';

/** Matches the list's CSS cap: max-h-[min(16rem,...)]. */
const LIST_MAX_HEIGHT = 256;

export const JMultiSelectImpl: React.FC<InterJMultiSelect> = (props) => {
  const merged = { ...JMULTI_SELECT_DEFAULTS, ...props };
  const [internalValues, setInternalValues] = useState<string[]>(merged.value);
  const currentValues = props.value ?? internalValues;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [listStyle, setListStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const listRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const selected = props.options.filter((o) => currentValues.includes(o.value));
  const filtered = props.options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  // Opens below the trigger, or above it when the viewport has no room below
  // (lower half of a phone screen, on-screen keyboard). Uses the measured list
  // height once rendered, the CSS max height before that.
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const height = listRef.current?.getBoundingClientRect().height || Math.min(LIST_MAX_HEIGHT, viewport.height - 32);
    const position = computeFloatingPosition(r, { width: Math.min(r.width, viewport.width - 16), height }, viewport);
    setListStyle(floatingStyle(position, { width: r.width }));
  };

  const openList = () => { updatePosition(); setOpen(true); setQuery(''); setTimeout(() => inputRef.current?.focus(), 0); };
  const closeList = () => { setOpen(false); setQuery(''); };

  const handleToggle = (opt: JMultiSelectOption) => {
    if (opt.disabled) return;
    const next = currentValues.includes(opt.value)
      ? currentValues.filter((v) => v !== opt.value)
      : [...currentValues, opt.value];
    const nextOpts = props.options.filter((o) => next.includes(o.value));
    setInternalValues(next);
    props.onChange?.(next, nextOpts);
  };

  const handleRemove = (value: string) => {
    const next = currentValues.filter((v) => v !== value);
    const nextOpts = props.options.filter((o) => next.includes(o.value));
    setInternalValues(next);
    props.onChange?.(next, nextOpts);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { closeList(); }
  };

  // Re-measure once the list is in the DOM (real height may change the side)
  useLayoutEffect(() => { if (open) updatePosition(); }, [open]);

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
    <JMultiSelectView
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

JMultiSelectImpl.displayName = 'JMultiSelect';
