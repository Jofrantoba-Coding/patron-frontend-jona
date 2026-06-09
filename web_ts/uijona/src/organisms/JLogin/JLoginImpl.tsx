// JLoginImpl.tsx — JONA Layer: Implementation (applies defaults + state)
import React, { useState } from 'react';
import { InterJLogin, JLOGIN_DEFAULTS } from './InterJLogin';
import { JLoginView } from './JLoginView';

type JLoginImplProps = Partial<InterJLogin> &
  Pick<InterJLogin, 'onSubmit'> & {
    // allow controlled mode by passing email/password + setters from outside
    email?: string;
    password?: string;
    setEmail?: (v: string) => void;
    setPassword?: (v: string) => void;
  };

export const JLoginImpl: React.FC<JLoginImplProps> = (props) => {
  const merged: InterJLogin = { ...JLOGIN_DEFAULTS, ...props } as InterJLogin;

  // Internal state only when not controlled from outside
  const [internalEmail, setInternalEmail] = useState('');
  const [internalPassword, setInternalPassword] = useState('');

  const email = props.email !== undefined ? props.email : internalEmail;
  const password = props.password !== undefined ? props.password : internalPassword;
  const setEmail = props.setEmail ?? setInternalEmail;
  const setPassword = props.setPassword ?? setInternalPassword;

  return (
    <JLoginView
      {...merged}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  );
};
