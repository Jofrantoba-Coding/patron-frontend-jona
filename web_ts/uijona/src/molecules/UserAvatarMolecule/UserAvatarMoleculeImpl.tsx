// UserAvatarMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterUserAvatarMolecule, USER_AVATAR_MOLECULE_DEFAULTS } from './InterUserAvatarMolecule';
import { UserAvatarMoleculeView } from './UserAvatarMoleculeView';

export const UserAvatarMoleculeImpl: React.FC<InterUserAvatarMolecule> = (props) => (
  <UserAvatarMoleculeView {...USER_AVATAR_MOLECULE_DEFAULTS} {...props} />
);
UserAvatarMoleculeImpl.displayName = 'UserAvatarMolecule';
