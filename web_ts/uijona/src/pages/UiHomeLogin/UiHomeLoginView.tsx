// UiHomeLoginView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeLogin } from './InterUiHomeLogin';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { LoginOrganismView } from '../../organisms/LoginOrganism';

export const UiHomeLoginView: React.FC<InterUiHomeLogin> = ({
  email,
  password,
  emailError,
  passwordError,
  alertMessage,
  isLoading,
  setEmail,
  setPassword,
  onSubmit,
  onGoToCreateAccount,
  onGoToRecoverPassword,
  appTitle,
  footerText,
}) => (
  <BorderLayoutView
    north={<span className="font-semibold text-lg">{appTitle}</span>}
    south={<span>{footerText}</span>}
    center={
      <LoginOrganismView
        email={email}
        password={password}
        emailError={emailError}
        passwordError={passwordError}
        alertMessage={alertMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={onSubmit}
        onGoToCreateAccount={onGoToCreateAccount}
        onGoToRecoverPassword={onGoToRecoverPassword}
      />
    }
  />
);
