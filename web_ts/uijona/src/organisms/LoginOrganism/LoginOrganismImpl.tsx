// LoginOrganismImpl.tsx — JONA Layer: Implementation (applies defaults + state)
import React, { useState } from 'react';
import { InterLoginOrganism, LOGIN_ORGANISM_DEFAULTS } from './InterLoginOrganism';
import { LoginOrganismView } from './LoginOrganismView';

type LoginOrganismImplProps = Partial<InterLoginOrganism> &
  Pick<InterLoginOrganism, 'onSubmit'> & {
    // allow controlled mode by passing email/password + setters from outside
    email?: string;
    password?: string;
    setEmail?: (v: string) => void;
    setPassword?: (v: string) => void;
  };

export const LoginOrganismImpl: React.FC<LoginOrganismImplProps> = (props) => {
  const merged: InterLoginOrganism = { ...LOGIN_ORGANISM_DEFAULTS, ...props } as InterLoginOrganism;

  // Internal state only when not controlled from outside
  const [internalEmail, setInternalEmail] = useState('');
  const [internalPassword, setInternalPassword] = useState('');

  const email = props.email !== undefined ? props.email : internalEmail;
  const password = props.password !== undefined ? props.password : internalPassword;
  const setEmail = props.setEmail ?? setInternalEmail;
  const setPassword = props.setPassword ?? setInternalPassword;

  return (
    <LoginOrganismView
      {...merged}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  );
};
