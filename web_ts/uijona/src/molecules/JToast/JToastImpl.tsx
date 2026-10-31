// JToastImpl.tsx — JONA Implementation
import React, { useEffect, useRef, useState } from 'react';
import { InterJToast, JTOAST_DEFAULTS } from './InterJToast';
import { JToastView } from './JToastView';

export const JToastImpl: React.FC<InterJToast> = ({
  id,
  duration = JTOAST_DEFAULTS.duration,
  onDismiss,
  ...props
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(duration);
  const paused = hovered || focused;

  // The timer runs only while neither hovered nor focused; a pause keeps the time left.
  useEffect(() => {
    if (!duration || paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => onDismiss?.(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [id, duration, paused, onDismiss]);

  return (
    <JToastView
      id={id}
      {...props}
      onDismissClick={() => onDismiss?.(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    />
  );
};

JToastImpl.displayName = 'JToast';
