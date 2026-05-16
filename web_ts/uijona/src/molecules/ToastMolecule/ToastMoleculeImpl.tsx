// ToastMoleculeImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterToastMolecule } from './InterToastMolecule';
import { ToastMoleculeView } from './ToastMoleculeView';

export const ToastMoleculeImpl: React.FC<InterToastMolecule> = ({ id, duration = 4000, onDismiss, ...props }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return <ToastMoleculeView id={id} {...props} onDismissClick={() => onDismiss?.(id)} />;
};

ToastMoleculeImpl.displayName = 'ToastMolecule';
