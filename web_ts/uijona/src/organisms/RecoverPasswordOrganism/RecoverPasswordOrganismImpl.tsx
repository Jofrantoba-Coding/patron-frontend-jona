// RecoverPasswordOrganismImpl.tsx — JONA Layer: Implementation (applies defaults)
import React, { useState } from 'react';
import { InterRecoverPasswordOrganism, RECOVER_PASSWORD_ORGANISM_DEFAULTS } from './InterRecoverPasswordOrganism';
import { RecoverPasswordOrganismView } from './RecoverPasswordOrganismView';

type RecoverPasswordOrganismImplProps = Partial<InterRecoverPasswordOrganism> &
  Pick<InterRecoverPasswordOrganism, 'onSubmit'> & {
    email?: string;
    setEmail?: (v: string) => void;
  };

export const RecoverPasswordOrganismImpl: React.FC<RecoverPasswordOrganismImplProps> = (props) => {
  const merged: InterRecoverPasswordOrganism = {
    ...RECOVER_PASSWORD_ORGANISM_DEFAULTS,
    ...props,
  } as InterRecoverPasswordOrganism;

  const [internalEmail, setInternalEmail] = useState('');
  const email = props.email !== undefined ? props.email : internalEmail;
  const setEmail = props.setEmail ?? setInternalEmail;

  return (
    <RecoverPasswordOrganismView
      {...merged}
      email={email}
      setEmail={setEmail}
    />
  );
};
