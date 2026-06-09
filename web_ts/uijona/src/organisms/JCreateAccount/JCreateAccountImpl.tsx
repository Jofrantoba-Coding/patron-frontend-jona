// JCreateAccountImpl.tsx — JONA Layer: Implementation (applies defaults)
import React, { useState } from 'react';
import { InterJCreateAccount, JCREATE_ACCOUNT_DEFAULTS } from './InterJCreateAccount';
import { JCreateAccountView } from './JCreateAccountView';

type JCreateAccountImplProps = Partial<InterJCreateAccount> &
  Pick<InterJCreateAccount, 'onSubmit'>;

export const JCreateAccountImpl: React.FC<JCreateAccountImplProps> = (props) => {
  const merged: InterJCreateAccount = {
    ...JCREATE_ACCOUNT_DEFAULTS,
    ...props,
  } as InterJCreateAccount;

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
    <JCreateAccountView
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
