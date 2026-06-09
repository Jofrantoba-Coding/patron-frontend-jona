// JHomeLoginView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJHomeLogin } from './InterJHomeLogin';
import { JBorderLayoutView } from '../../layouts/JBorderLayout';
import { JLoginView } from '../../organisms/JLogin';
import { JHeaderPageView } from '../../organisms/JHeaderPage';
import { JFooterPageView } from '../../organisms/JFooterPage';

export const JHomeLoginView: React.FC<InterJHomeLogin> = ({
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
  <JBorderLayoutView
    north={<JHeaderPageView title={appTitle} />}
    south={<JFooterPageView text={footerText} />}
    center={
      <JLoginView
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
