// JDrawerImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterJDrawer, JDRAWER_DEFAULTS } from './InterJDrawer';
import { JDrawerView } from './JDrawerView';

export const JDrawerImpl: React.FC<InterJDrawer> = (props) => {
  const merged = { ...JDRAWER_DEFAULTS, ...props };

  useEffect(() => {
    if (!merged.open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [merged.open, props.onClose]);

  return (
    <JDrawerView
      open={merged.open}
      side={merged.side}
      size={merged.size}
      showCloseButton={merged.showCloseButton}
      title={props.title}
      description={props.description}
      className={props.className}
      footer={props.footer}
      onClose={props.onClose}
      onOverlayClick={props.onClose}
    >
      {props.children}
    </JDrawerView>
  );
};

JDrawerImpl.displayName = 'JDrawer';
