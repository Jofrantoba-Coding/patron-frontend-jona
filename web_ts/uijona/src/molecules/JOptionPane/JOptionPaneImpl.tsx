// JOptionPaneImpl.tsx — JONA Implementation
import React, { useEffect, useRef } from 'react';
import { InterJOptionPane, JOPTIONPANE_DEFAULTS } from './InterJOptionPane';
import { JOptionPaneView } from './JOptionPaneView';
import { useFocusTrap } from '../../lib/focus';

export const JOptionPaneImpl: React.FC<InterJOptionPane> = (props) => {
  const merged = { ...JOPTIONPANE_DEFAULTS, ...props };
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  // Focus goes to the panel (not "Confirm") so a stray Enter is not destructive
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onPanelKeyDown = useFocusTrap(panelRef, props.open);

  // Runs after the trap has focused the panel: move on to the requested button.
  useEffect(() => {
    if (!props.open || !props.initialFocus) return;
    (props.initialFocus === 'cancel' ? cancelRef : confirmRef).current?.focus();
  }, [props.open, props.initialFocus]);

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
      details={props.details}
      variant={merged.variant}
      confirmLabel={merged.confirmLabel}
      cancelLabel={merged.cancelLabel}
      isLoading={merged.isLoading}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
      panelRef={panelRef}
      onPanelKeyDown={onPanelKeyDown}
      confirmRef={confirmRef}
      cancelRef={cancelRef}
    />
  );
};

JOptionPaneImpl.displayName = 'JOptionPane';
