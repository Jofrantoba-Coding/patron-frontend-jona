// CreateAccountOrganismImpl.tsx — JONA Layer: Implementation (applies defaults)
import React, { useState } from 'react';
import { InterCreateAccountOrganism, CREATE_ACCOUNT_ORGANISM_DEFAULTS } from './InterCreateAccountOrganism';
import { CreateAccountOrganismView } from './CreateAccountOrganismView';

type CreateAccountOrganismImplProps = Partial<InterCreateAccountOrganism> &
  Pick<InterCreateAccountOrganism, 'onSubmit'>;

export const CreateAccountOrganismImpl: React.FC<CreateAccountOrganismImplProps> = (props) => {
  const merged: InterCreateAccountOrganism = {
    ...CREATE_ACCOUNT_ORGANISM_DEFAULTS,
    ...props,
  } as InterCreateAccountOrganism;

  const [internalName, setInternalName] = useState('');
  const [internalEmail, setInternalEmail] = useState('');
  const [internalPassword, setInternalPassword] = useState('');
  const [internalConfirmPassword, setInternalConfirmPassword] = useState('');

  const name = props.name !== undefined ? props.name : internalName;
  const email = props.email !== undefined ? props.email : internalEmail;
  const password = props.password !== undefined ? props.password : internalPassword;
  const confirmPassword = props.confirmPassword !== undefined ? props.confirmPassword : internalConfirmPassword;

  const setName = props.setName ?? setInternalName;
  const setEmail = props.setEmail ?? setInternalEmail;
  const setPassword = props.setPassword ?? setInternalPassword;
  const setConfirmPassword = props.setConfirmPassword ?? setInternalConfirmPassword;

  return (
    <CreateAccountOrganismView
      {...merged}
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
    />
  );
};
