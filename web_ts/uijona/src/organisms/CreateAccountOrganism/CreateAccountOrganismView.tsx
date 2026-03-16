// CreateAccountOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterCreateAccountOrganism } from './InterCreateAccountOrganism';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { AlertMolecule } from '../../molecules/AlertMolecule';

export const CreateAccountOrganismView: React.FC<InterCreateAccountOrganism> = ({
  name,
  email,
  password,
  confirmPassword,
  nameError,
  emailError,
  passwordError,
  confirmPasswordError,
  alertMessage,
  isLoading,
  setName,
  setEmail,
  setPassword,
  setConfirmPassword,
  onSubmit,
  onGoToLogin,
}) => (
  <CardMolecule className="w-full max-w-sm mx-auto">
    <CardHeader>
      <CardTitle>Create account</CardTitle>
      <CardDescription>Fill in your details to get started</CardDescription>
    </CardHeader>

    <CardContent>
      {alertMessage && (
        <AlertMolecule variant="destructive" title="Error" className="mb-4">
          {alertMessage}
        </AlertMolecule>
      )}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormFieldMolecule
          id="txtName"
          label="Full name"
          type="text"
          value={name}
          onChange={(value) => setName(value)}
          placeholder="John Doe"
          errorMessage={nameError}
          required
        />
        <FormFieldMolecule
          id="txtCreateEmail"
          label="Email"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          placeholder="you@example.com"
          errorMessage={emailError}
          required
        />
        <FormFieldMolecule
          id="txtCreatePassword"
          label="Password"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          placeholder="••••••••"
          errorMessage={passwordError}
          required
        />
        <FormFieldMolecule
          id="txtConfirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          placeholder="••••••••"
          errorMessage={confirmPasswordError}
          required
        />
        <ButtonAtom type="submit" fullWidth loading={isLoading}>
          Create account
        </ButtonAtom>
      </form>
    </CardContent>

    <CardFooter>
      {onGoToLogin && (
        <ButtonAtom variant="ghost" fullWidth onClick={onGoToLogin}>
          Already have an account? Sign in
        </ButtonAtom>
      )}
    </CardFooter>
  </CardMolecule>
);
