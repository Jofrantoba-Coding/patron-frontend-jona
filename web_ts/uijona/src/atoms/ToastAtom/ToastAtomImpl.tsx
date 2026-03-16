// ToastAtomImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterToastAtom } from './InterToastAtom';
import { ToastAtomView } from './ToastAtomView';

export const ToastAtomImpl: React.FC<InterToastAtom> = ({ id, duration = 4000, onDismiss, ...props }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return <ToastAtomView id={id} {...props} onDismissClick={() => onDismiss?.(id)} />;
};

ToastAtomImpl.displayName = 'ToastAtom';
