// JContextChipView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { FG_MUTED, LINE, SURFACE_MUTED, TEXT_SMALL } from '../../theme/tokenClasses';

export interface JContextChipViewProps {
  text: string;
  pairs: string;
  pairsId: string;
}

export const JContextChipView: React.FC<JContextChipViewProps> = ({ text, pairs, pairsId }) => (
  <>
    <p
      title={pairs}
      aria-describedby={pairsId}
      className={cn('inline-block min-w-0 max-w-full truncate rounded-full border px-3 py-1 align-middle', TEXT_SMALL, FG_MUTED, LINE, SURFACE_MUTED)}
    >
      {text}
    </p>
    <span id={pairsId} hidden>{pairs}</span>
  </>
);
