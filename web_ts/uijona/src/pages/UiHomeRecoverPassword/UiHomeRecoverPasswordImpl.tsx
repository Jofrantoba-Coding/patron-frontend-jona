// UiHomeRecoverPasswordImpl.tsx — JONA Layer: Implementation (state + handlers)
import React, { useState } from 'react';
import { InterUiHomeRecoverPassword, UI_HOME_RECOVER_PASSWORD_DEFAULTS } from './InterUiHomeRecoverPassword';
import { UiHomeRecoverPasswordView } from './UiHomeRecoverPasswordView';

type UiHomeRecoverPasswordImplProps = Partial<InterUiHomeRecoverPassword> & {
  /** Called with email when validation passes */
  onRecover?: (email: string) => void | Promise<void>;
};

export const UiHomeRecoverPasswordImpl: React.FC<UiHomeRecoverPasswordImplProps> = (props) => {
  const merged = { ...UI_HOME_RECOVER_PASSWORD_DEFAULTS, ...props };

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

  const viewProps: InterUiHomeRecoverPassword = {
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

  return <UiHomeRecoverPasswordView {...viewProps} />;
};
