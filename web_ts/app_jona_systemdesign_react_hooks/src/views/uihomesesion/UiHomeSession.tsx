// UiHomeSession.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Composes BorderLayout + CardMolecule + UserAvatarMolecule + ButtonAtom.
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { BadgeAtom } from '../../atoms/BadgeAtom';

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
        <div className="flex items-center justify-center min-h-full py-8 px-4">
          <CardMolecule className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dashboard</CardTitle>
                <BadgeAtom variant="secondary">Active session</BadgeAtom>
              </div>
              <CardDescription>Welcome back to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <UserAvatarMolecule name={name} email={email} size="lg" />
            </CardContent>
            <CardFooter>
              <ButtonAtom variant="destructive" fullWidth onClick={onLogout}>
                Sign out
              </ButtonAtom>
            </CardFooter>
          </CardMolecule>
        </div>
      }
    />
  );
};
