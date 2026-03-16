// TextAtom.tsx — Level 1: Atom
// Indivisible text/paragraph element. No business logic.
import React from 'react';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

interface TextAtomProps {
  content: string;
  size?: TextSize;
  muted?: boolean;
}

const sizeClasses: Record<TextSize, string> = {
  xs:   'text-xs',
  sm:   'text-sm',
  base: 'text-base',
  lg:   'text-lg',
  xl:   'text-xl',
};

export const TextAtom: React.FC<TextAtomProps> = ({
  content,
  size = 'base',
  muted = false,
}) => {
  return (
    <p className={`${sizeClasses[size]} ${muted ? 'text-neutral-500' : 'text-neutral-900'}`}>
      {content}
    </p>
  );
};
