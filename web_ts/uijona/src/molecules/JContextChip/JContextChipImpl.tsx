// JContextChipImpl.tsx — JONA Implementation
import React, { useId } from 'react';
import { contextPairs, contextText, InterJContextChip } from './InterJContextChip';
import { JContextChipView } from './JContextChipView';

export const JContextChipImpl: React.FC<InterJContextChip> = ({ items }) => {
  const pairsId = `${useId()}-pairs`;
  if (items.length === 0) return null;
  return <JContextChipView text={contextText(items)} pairs={contextPairs(items)} pairsId={pairsId} />;
};

JContextChipImpl.displayName = 'JContextChip';
