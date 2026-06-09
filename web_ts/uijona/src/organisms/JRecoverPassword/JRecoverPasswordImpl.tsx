// JRecoverPasswordImpl.tsx — JONA Layer: Implementation (applies defaults)
import React, { useState } from 'react';
import { InterJRecoverPassword, JRECOVER_PASSWORD_DEFAULTS } from './InterJRecoverPassword';
import { JRecoverPasswordView } from './JRecoverPasswordView';

type JRecoverPasswordImplProps = Partial<InterJRecoverPassword> &
  Pick<InterJRecoverPassword, 'onSubmit'> & {
    email?: string;
    setEmail?: (v: string) => void;
  };

export const JRecoverPasswordImpl: React.FC<JRecoverPasswordImplProps> = (props) => {
  const merged: InterJRecoverPassword = {
    ...JRECOVER_PASSWORD_DEFAULTS,
    ...props,
  } as InterJRecoverPassword;

  const [internalEmail, setInternalEmail] = useState('');
  const email = props.email !== undefined ? props.email : internalEmail;
  const setEmail = props.setEmail ?? setInternalEmail;

  return (
    <JRecoverPasswordView
      {...merged}
      email={email}
      setEmail={setEmail}
    />
  );
};
