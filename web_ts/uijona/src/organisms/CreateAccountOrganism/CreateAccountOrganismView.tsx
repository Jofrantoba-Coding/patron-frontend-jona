// CreateAccountOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterCreateAccountOrganism } from './InterCreateAccountOrganism';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { JFormField } from '../../molecules/JFormField';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';

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
        <JAlert variant="danger" title="Error" className="mb-4">
          {alertMessage}
        </JAlert>
      )}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <JFormField
          id="txtName"
          label="Full name"
          type="text"
          value={name}
          onChange={(value) => setName(value)}
          placeholder="John Doe"
          errorMessage={nameError}
          required
        />
        <JFormField
          id="txtCreateEmail"
          label="Email"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          placeholder="you@example.com"
          errorMessage={emailError}
          required
        />
        <JFormField
          id="txtCreatePassword"
          label="Password"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          placeholder="••••••••"
          errorMessage={passwordError}
          required
        />
        <JFormField
          id="txtConfirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          placeholder="••••••••"
          errorMessage={confirmPasswordError}
          required
        />
        <JButton type="submit" fullWidth loading={isLoading}>
          Create account
        </JButton>
      </form>
    </CardContent>

    <CardFooter>
      {onGoToLogin && (
        <JButton variant="ghost" fullWidth onClick={onGoToLogin}>
          Already have an account? Sign in
        </JButton>
      )}
    </CardFooter>
  </CardMolecule>
);
