// LabelAtom.tsx — Level 1: Atom
// Indivisible label element. No business logic.
import React from 'react';

interface LabelAtomProps {
  htmlFor: string;
  text: string;
}

export const LabelAtom: React.FC<LabelAtomProps> = ({ htmlFor, text }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1 text-sm font-medium text-neutral-700"
    >
      {text}
    </label>
  );
};
