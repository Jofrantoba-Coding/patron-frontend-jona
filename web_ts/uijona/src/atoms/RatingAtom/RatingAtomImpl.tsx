// RatingAtomImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterRatingAtom, RATING_ATOM_DEFAULTS } from './InterRatingAtom';
import { RatingAtomView } from './RatingAtomView';

export const RatingAtomImpl: React.FC<InterRatingAtom> = (props) => {
  const merged = { ...RATING_ATOM_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState(RATING_ATOM_DEFAULTS.value);
  const [hovered, setHovered] = useState<number | null>(null);

  const effectiveValue = props.value ?? internalValue;

  const handleClick = (star: number) => {
    if (merged.readOnly) return;
    setInternalValue(star);
    props.onChange?.(star);
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
    <RatingAtomView
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

RatingAtomImpl.displayName = 'RatingAtom';
