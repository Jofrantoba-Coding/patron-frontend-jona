// RatingMoleculeImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterRatingMolecule, RATING_MOLECULE_DEFAULTS } from './InterRatingMolecule';
import { RatingMoleculeView } from './RatingMoleculeView';

export const RatingMoleculeImpl: React.FC<InterRatingMolecule> = (props) => {
  const merged = { ...RATING_MOLECULE_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState(RATING_MOLECULE_DEFAULTS.value);
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
    <RatingMoleculeView
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

RatingMoleculeImpl.displayName = 'RatingMolecule';
