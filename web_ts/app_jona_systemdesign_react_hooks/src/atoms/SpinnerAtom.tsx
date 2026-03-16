// SpinnerAtom.tsx — Level 1: Atom
// Loading spinner feedback element. No business logic.
import React from 'react';

export const SpinnerAtom: React.FC = () => {
  return (
    <div
      role="status"
      className="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
      aria-label="Loading"
    />
  );
};
