// RecoverPasswordOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterRecoverPasswordOrganism } from './InterRecoverPasswordOrganism';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';

export const RecoverPasswordOrganismView: React.FC<InterRecoverPasswordOrganism> = ({
  email,
  emailError,
  alertMessage,
  successMessage,
  isLoading,
  setEmail,
  onSubmit,
  onGoToLogin,
}) => (
  <CardMolecule className="w-full max-w-sm mx-auto">
    <CardHeader>
      <CardTitle>Recover password</CardTitle>
      <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
    </CardHeader>

    <CardContent>
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
        <FormFieldMolecule
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
    </CardContent>

    <CardFooter>
      {onGoToLogin && (
        <JButton variant="ghost" fullWidth onClick={onGoToLogin}>
          Back to sign in
        </JButton>
      )}
    </CardFooter>
  </CardMolecule>
);
