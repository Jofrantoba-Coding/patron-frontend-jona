// UiHomeSession.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Composes BorderLayout + UserAvatarMolecule + ButtonAtom.
// No service calls — UI designer's responsibility.
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';

interface UiHomeSessionProps {
  name: string;
  email: string;
  onLogout: () => void;
}

export const UiHomeSession: React.FC<UiHomeSessionProps> = ({ name, email, onLogout }) => {
  return (
    <BorderLayout
      north={<span className="font-semibold text-lg">JONA System Design</span>}
      south={<span>© 2026 JONA Pattern — @jofrantoba</span>}
      center={
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-token-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900">Welcome back</h2>
          <UserAvatarMolecule name={name} email={email} />
          <ButtonAtom label="Logout" variant="danger" onClick={onLogout} fullWidth />
        </div>
      }
    />
  );
};
