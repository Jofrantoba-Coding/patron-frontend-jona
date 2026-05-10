// RatingAtomImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterRatingAtom, RATING_ATOM_DEFAULTS } from './InterRatingAtom';
import { RatingAtomView } from './RatingAtomView';

export const RatingAtomImpl: React.FC<InterRatingAtom> = (props) => {
  const merged = { ...RATING_ATOM_DEFAULTS, ...props };
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (star: number) => {
    if (merged.readOnly) return;
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
      value={merged.value}
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
