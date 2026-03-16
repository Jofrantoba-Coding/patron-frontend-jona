// UserAvatarMolecule.tsx — Level 2: Molecule
// Combines avatar initials + TextAtom to display authenticated user info.
// No business logic — only composes Atoms.
import React from 'react';
import { TextAtom } from '../atoms/TextAtom';

interface UserAvatarMoleculeProps {
  name: string;
  email: string;
}

export const UserAvatarMolecule: React.FC<UserAvatarMoleculeProps> = ({ name, email }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
        {initials || '?'}
      </div>
      <div>
        <TextAtom content={name} size="sm" />
        <TextAtom content={email} size="xs" muted />
      </div>
    </div>
  );
};
