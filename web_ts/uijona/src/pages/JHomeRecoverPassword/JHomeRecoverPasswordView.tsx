// JHomeRecoverPasswordView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJHomeRecoverPassword } from './InterJHomeRecoverPassword';
import { JBorderLayoutView } from '../../layouts/JBorderLayout';
import { JRecoverPasswordView } from '../../organisms/JRecoverPassword';
import { JHeaderPageView } from '../../organisms/JHeaderPage';
import { JFooterPageView } from '../../organisms/JFooterPage';

export const JHomeRecoverPasswordView: React.FC<InterJHomeRecoverPassword> = ({
  email,
  emailError,
  alertMessage,
  successMessage,
  isLoading,
  setEmail,
  onSubmit,
  onGoToLogin,
  appTitle,
  footerText,
}) => (
  <JBorderLayoutView
    north={<JHeaderPageView title={appTitle} />}
    south={<JFooterPageView text={footerText} />}
    center={
      <JRecoverPasswordView
        email={email}
        emailError={emailError}
        alertMessage={alertMessage}
        successMessage={successMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        onSubmit={onSubmit}
        onGoToLogin={onGoToLogin}
      />
    }
  />
);
