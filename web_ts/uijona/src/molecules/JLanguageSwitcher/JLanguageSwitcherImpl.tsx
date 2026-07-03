// JLanguageSwitcherImpl.tsx — JONA Implementation (gestiona apertura y foco)
import React, { useEffect, useRef, useState } from 'react';
import { InterJLanguageSwitcher, JLANGUAGE_SWITCHER_DEFAULTS } from './InterJLanguageSwitcher';
import { JLanguageSwitcherView } from './JLanguageSwitcherView';

export const JLanguageSwitcherImpl: React.FC<InterJLanguageSwitcher> = ({ onChange, ...props }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const menuRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <JLanguageSwitcherView
      {...JLANGUAGE_SWITCHER_DEFAULTS}
      {...props}
      onChange={onChange}
      open={open}
      onToggle={() => setOpen((v) => !v)}
      onSelect={handleSelect}
      triggerRef={triggerRef}
      menuRef={menuRef}
    />
  );
};

JLanguageSwitcherImpl.displayName = 'JLanguageSwitcher';
