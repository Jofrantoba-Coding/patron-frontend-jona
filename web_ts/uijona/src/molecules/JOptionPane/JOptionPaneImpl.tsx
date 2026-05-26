// JOptionPaneImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterJOptionPane, JOPTIONPANE_DEFAULTS } from './InterJOptionPane';
import { JOptionPaneView } from './JOptionPaneView';

export const JOptionPaneImpl: React.FC<InterJOptionPane> = (props) => {
  const merged = { ...JOPTIONPANE_DEFAULTS, ...props };

  useEffect(() => {
    if (!props.open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [props.open, props.onCancel]);

  return (
    <JOptionPaneView
      open={props.open}
      title={props.title}
      description={props.description}
      variant={merged.variant}
      confirmLabel={merged.confirmLabel}
      cancelLabel={merged.cancelLabel}
      isLoading={merged.isLoading}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
};

JOptionPaneImpl.displayName = 'JOptionPane';
