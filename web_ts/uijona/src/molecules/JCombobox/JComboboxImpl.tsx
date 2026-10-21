// JComboboxImpl.tsx — JONA Implementation
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { JComboboxOption, InterJCombobox, JCOMBOBOX_MOLECULE_DEFAULTS } from './InterJCombobox';
import { JComboboxView } from './JComboboxView';
import { computeFloatingPosition, floatingStyle } from '../../lib/floating';

/** Matches the list's CSS cap: max-h-[min(16rem,...)]. */
const LIST_MAX_HEIGHT = 256;

export const JComboboxImpl: React.FC<InterJCombobox> = (props) => {
  const merged = { ...JCOMBOBOX_MOLECULE_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState<string | undefined>(undefined);
  const effectiveValue = props.value ?? internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [listStyle, setListStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const listRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const selected = props.options.find((o) => o.value === effectiveValue) ?? null;

  const filtered = props.options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

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

  const openList = () => {
    updatePosition();
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeList = () => { setOpen(false); setQuery(''); };

  const handleSelect = (opt: JComboboxOption) => {
    if (opt.disabled) return;
    setInternalValue(opt.value);
    props.onChange?.(opt.value, opt);
    closeList();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); openList(); } return; }
    if (e.key === 'Escape') { closeList(); triggerRef.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered[activeIndex]) { e.preventDefault(); handleSelect(filtered[activeIndex]); }
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
    <JComboboxView
      selected={selected}
      query={query}
      filtered={filtered}
      open={open}
      disabled={merged.disabled}
      placeholder={merged.placeholder}
      searchPlaceholder={merged.searchPlaceholder}
      emptyText={merged.emptyText}
      className={props.className}
      listStyle={listStyle}
      triggerRef={triggerRef}
      inputRef={inputRef}
      listRef={listRef}
      activeIndex={activeIndex}
      onTriggerClick={() => (open ? closeList() : openList())}
      onQueryChange={(q) => { setQuery(q); setActiveIndex(0); props.onSearchChange?.(q); }}
      onSelect={handleSelect}
      onKeyDown={handleKeyDown}
    />
  );
};

JComboboxImpl.displayName = 'JCombobox';
