// JHomeRecoverPasswordImpl.tsx — JONA Layer: Implementation (state + handlers)
import React, { useState } from 'react';
import { InterJHomeRecoverPassword, JHOME_RECOVER_PASSWORD_DEFAULTS } from './InterJHomeRecoverPassword';
import { JHomeRecoverPasswordView } from './JHomeRecoverPasswordView';

type JHomeRecoverPasswordImplProps = Partial<InterJHomeRecoverPassword> & {
  /** Called with email when validation passes */
  onRecover?: (email: string) => void | Promise<void>;
};

export const JHomeRecoverPasswordImpl: React.FC<JHomeRecoverPasswordImplProps> = (props) => {
  const merged = { ...JHOME_RECOVER_PASSWORD_DEFAULTS, ...props };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(merged.emailError);
  const [alertMessage, setAlertMessage] = useState(merged.alertMessage);
  const [successMessage, setSuccessMessage] = useState(merged.successMessage);
  const [isLoading, setIsLoading] = useState(merged.isLoading);

  function validate(): boolean {
    const err = !email ? 'Email is required' : '';
    setEmailError(err);
    return !err;
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setAlertMessage('');
    setSuccessMessage('');
    try {
      await props.onRecover?.(email);
      setSuccessMessage('Check your inbox for the reset link.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setAlertMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const viewProps: InterJHomeRecoverPassword = {
    email,
    emailError,
    alertMessage,
    successMessage,
    isLoading,
    setEmail,
    onSubmit,
    onGoToLogin: props.onGoToLogin,
    appTitle: merged.appTitle,
    footerText: merged.footerText,
  };

  return <JHomeRecoverPasswordView {...viewProps} />;
};
