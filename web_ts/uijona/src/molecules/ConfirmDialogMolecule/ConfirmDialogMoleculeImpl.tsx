// ConfirmDialogMoleculeImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterConfirmDialogMolecule, CONFIRM_DIALOG_MOLECULE_DEFAULTS } from './InterConfirmDialogMolecule';
import { ConfirmDialogMoleculeView } from './ConfirmDialogMoleculeView';

export const ConfirmDialogMoleculeImpl: React.FC<InterConfirmDialogMolecule> = (props) => {
  const merged = { ...CONFIRM_DIALOG_MOLECULE_DEFAULTS, ...props };

  useEffect(() => {
    if (!props.open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [props.open, props.onCancel]);

  return (
    <ConfirmDialogMoleculeView
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

ConfirmDialogMoleculeImpl.displayName = 'ConfirmDialogMolecule';
