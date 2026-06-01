// JToastImpl.tsx — JONA Implementation
import React, { useEffect } from 'react';
import { InterJToast, JTOAST_DEFAULTS } from './InterJToast';
import { JToastView } from './JToastView';

export const JToastImpl: React.FC<InterJToast> = ({
  id,
  duration = JTOAST_DEFAULTS.duration,
  onDismiss,
  ...props
}) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return <JToastView id={id} {...props} onDismissClick={() => onDismiss?.(id)} />;
};

JToastImpl.displayName = 'JToast';
