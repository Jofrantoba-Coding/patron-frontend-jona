// JRecoverPasswordView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJRecoverPassword } from './InterJRecoverPassword';
import { JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JCardFooter } from '../../molecules/JCard';
import { JFormField } from '../../molecules/JFormField';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';

export const JRecoverPasswordView: React.FC<InterJRecoverPassword> = ({
  email,
  emailError,
  alertMessage,
  successMessage,
  isLoading,
  setEmail,
  onSubmit,
  onGoToLogin,
}) => (
  <JCard className="w-full max-w-sm mx-auto">
    <JCardHeader>
      <JCardTitle>Recover password</JCardTitle>
      <JCardDescription>Enter your email and we'll send you a reset link</JCardDescription>
    </JCardHeader>

    <JCardContent>
      {alertMessage && (
        <JAlert variant="danger" title="Error" className="mb-4">
          {alertMessage}
        </JAlert>
      )}
      {successMessage && (
        <JAlert variant="success" title="Email sent" className="mb-4">
          {successMessage}
        </JAlert>
      )}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <JFormField
          id="txtRecoverEmail"
          label="Email"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          placeholder="you@example.com"
          errorMessage={emailError}
          required
        />
        <JButton type="submit" fullWidth loading={isLoading}>
          Send reset link
        </JButton>
      </form>
    </JCardContent>

    <JCardFooter>
      {onGoToLogin && (
        <JButton variant="ghost" fullWidth onClick={onGoToLogin}>
          Back to sign in
        </JButton>
      )}
    </JCardFooter>
  </JCard>
);
