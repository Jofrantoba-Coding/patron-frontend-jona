import { AvatarAtom } from '../atoms/AvatarAtom';
import { TextAtom } from '../atoms/TextAtom';

export interface UserAvatarMoleculeProps {
  name: string;
  email: string;
}

export function UserAvatarMolecule({ name, email }: UserAvatarMoleculeProps) {
  return (
    <div className="user-avatar-molecule">
      <AvatarAtom name={name} size="lg" />
      <div className="stack-xs">
        <TextAtom as="strong" tone="strong">
          {name}
        </TextAtom>
        <TextAtom tone="muted">{email}</TextAtom>
      </div>
    </div>
  );
}
