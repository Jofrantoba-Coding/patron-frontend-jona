// JRatingImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterJRating, JRATING_DEFAULTS } from './InterJRating';
import { JRatingView } from './JRatingView';

export const JRatingImpl: React.FC<InterJRating> = (props) => {
  const merged = { ...JRATING_DEFAULTS, ...props };

  const [internalValue, setInternalValue] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  // Si props.value está definido → controlado; si no → uncontrolled con internalValue
  const effectiveValue = props.value ?? internalValue;

  const handleClick = (star: number) => {
    if (merged.readOnly) return;
    // Toggle: clic en la estrella activa reinicia a 0
    const next = star === effectiveValue ? 0 : star;
    setInternalValue(next);
    props.onChange?.(next);
  };

  const handleEnter = (star: number) => {
    if (merged.readOnly) return;
    setHovered(star);
    props.onHover?.(star);
  };

  const handleLeave = () => {
    if (merged.readOnly) return;
    setHovered(null);
    props.onHover?.(null);
  };

  return (
    <JRatingView
      value={effectiveValue}
      max={merged.max}
      readOnly={merged.readOnly}
      size={merged.size}
      hovered={hovered}
      className={props.className}
      onStarClick={handleClick}
      onStarEnter={handleEnter}
      onStarLeave={handleLeave}
    />
  );
};

JRatingImpl.displayName = 'JRating';
