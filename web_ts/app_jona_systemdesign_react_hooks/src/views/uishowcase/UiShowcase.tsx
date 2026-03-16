// UiShowcase.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Demonstrates all design system components: atoms + molecules.
// No service calls — UI designer's responsibility.
import React, { useState } from 'react';
import { InterUiShowcase } from './InterUiShowcase';

// Atoms
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { BadgeAtom } from '../../atoms/BadgeAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { SpinnerAtom } from '../../atoms/SpinnerAtom';
import { SeparatorAtom } from '../../atoms/SeparatorAtom';
import { AvatarAtom } from '../../atoms/AvatarAtom';

// Molecules
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { AlertMolecule } from '../../molecules/AlertMolecule';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { CheckboxFieldMolecule } from '../../molecules/CheckboxFieldMolecule';
import { SelectFieldMolecule } from '../../molecules/SelectFieldMolecule';
import { DialogMolecule } from '../../molecules/DialogMolecule';
import {
  TableMolecule, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from '../../molecules/TableMolecule';

// Template hook
export function useUiShowcase(): InterUiShowcase & {
  dialogOpen: boolean;
  selectedRole: string;
  termsAccepted: boolean;
} {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  function openDialog(): void { setDialogOpen(true); }
  function closeDialog(): void { setDialogOpen(false); }
  function onRoleChange(value: string): void { setSelectedRole(value); }
  function onTermsChange(checked: boolean): void { setTermsAccepted(checked); }

  return { dialogOpen, selectedRole, termsAccepted, openDialog, closeDialog, onRoleChange, onTermsChange };
}

// Mock table data
const INVOICES = [
  { id: 'INV001', status: 'Paid',    method: 'Credit Card',    amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal',         amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid',  method: 'Bank Transfer',  amount: '$350.00' },
];

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Paid:    'default',
  Pending: 'secondary',
  Unpaid:  'destructive',
};

const ROLE_OPTIONS = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

interface UiShowcaseProps {
  dialogOpen: boolean;
  selectedRole: string;
  termsAccepted: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  onRoleChange: (value: string) => void;
  onTermsChange: (checked: boolean) => void;
}

export const UiShowcase: React.FC<UiShowcaseProps> = ({
  dialogOpen, selectedRole, termsAccepted,
  openDialog, closeDialog, onRoleChange, onTermsChange,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">

      {/* Header */}
      <div>
        <TextAtom as="h1" size="2xl" color="default">JONA Design System</TextAtom>
        <TextAtom size="sm" color="muted" className="mt-1">
          Component showcase — Atomic Design + JONA pattern
        </TextAtom>
      </div>

      <SeparatorAtom />

      {/* Buttons */}
      <Section title="ButtonAtom — variants">
        <div className="flex flex-wrap gap-2">
          <ButtonAtom>Default</ButtonAtom>
          <ButtonAtom variant="outline">Outline</ButtonAtom>
          <ButtonAtom variant="ghost">Ghost</ButtonAtom>
          <ButtonAtom variant="secondary">Secondary</ButtonAtom>
          <ButtonAtom variant="destructive">Destructive</ButtonAtom>
          <ButtonAtom variant="link">Link</ButtonAtom>
          <ButtonAtom loading>Loading</ButtonAtom>
          <ButtonAtom disabled>Disabled</ButtonAtom>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <ButtonAtom size="sm">Small</ButtonAtom>
          <ButtonAtom size="default">Default</ButtonAtom>
          <ButtonAtom size="lg">Large</ButtonAtom>
        </div>
      </Section>

      <SeparatorAtom />

      {/* Badges */}
      <Section title="BadgeAtom — variants">
        <div className="flex flex-wrap gap-2">
          <BadgeAtom variant="default">Default</BadgeAtom>
          <BadgeAtom variant="secondary">Secondary</BadgeAtom>
          <BadgeAtom variant="destructive">Destructive</BadgeAtom>
          <BadgeAtom variant="outline">Outline</BadgeAtom>
          <BadgeAtom variant="ghost">Ghost</BadgeAtom>
        </div>
      </Section>

      <SeparatorAtom />

      {/* Avatars */}
      <Section title="AvatarAtom — sizes + fallback">
        <div className="flex items-end gap-3">
          <AvatarAtom fallback="John Doe" size="xs" />
          <AvatarAtom fallback="John Doe" size="sm" />
          <AvatarAtom fallback="John Doe" size="md" />
          <AvatarAtom fallback="John Doe" size="lg" />
          <AvatarAtom fallback="John Doe" size="xl" />
        </div>
      </Section>

      <SeparatorAtom />

      {/* Spinner */}
      <Section title="SpinnerAtom — sizes">
        <div className="flex items-center gap-4 text-primary-600">
          <SpinnerAtom size="sm" />
          <SpinnerAtom size="md" />
          <SpinnerAtom size="lg" />
        </div>
      </Section>

      <SeparatorAtom />

      {/* Alerts */}
      <Section title="AlertMolecule — variants">
        <div className="space-y-3">
          <AlertMolecule title="Information" variant="default">
            This is a default informational alert message.
          </AlertMolecule>
          <AlertMolecule title="Error" variant="destructive">
            Something went wrong. Please try again.
          </AlertMolecule>
        </div>
      </Section>

      <SeparatorAtom />

      {/* Form fields */}
      <Section title="FormFieldMolecule + SelectFieldMolecule + CheckboxFieldMolecule">
        <CardMolecule>
          <CardHeader>
            <CardTitle>User settings</CardTitle>
            <CardDescription>Update your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFieldMolecule
              id="showcase-name"
              label="Full name"
              placeholder="John Doe"
              description="This will be displayed on your profile."
            />
            <FormFieldMolecule
              id="showcase-email-err"
              label="Email"
              type="email"
              placeholder="you@example.com"
              errorMessage="Please enter a valid email address."
              required
            />
            <SelectFieldMolecule
              id="showcase-role"
              label="Role"
              options={ROLE_OPTIONS}
              placeholder="Select a role..."
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              description="Choose the user's access level."
            />
            <CheckboxFieldMolecule
              id="showcase-terms"
              label="Accept terms and conditions"
              checked={termsAccepted}
              onCheckedChange={onTermsChange}
              description="By checking this, you agree to our terms of service."
            />
          </CardContent>
          <CardFooter>
            <ButtonAtom variant="outline" onClick={() => {}}>Cancel</ButtonAtom>
            <ButtonAtom>Save changes</ButtonAtom>
          </CardFooter>
        </CardMolecule>
      </Section>

      <SeparatorAtom />

      {/* Dialog */}
      <Section title="DialogMolecule">
        <ButtonAtom variant="outline" onClick={openDialog}>Open Dialog</ButtonAtom>
        <DialogMolecule
          open={dialogOpen}
          onClose={closeDialog}
          title="Confirm action"
          description="This action cannot be undone. Are you sure you want to continue?"
          footer={
            <>
              <ButtonAtom variant="outline" onClick={closeDialog}>Cancel</ButtonAtom>
              <ButtonAtom variant="destructive" onClick={closeDialog}>Confirm</ButtonAtom>
            </>
          }
        >
          <p>All associated data will be permanently removed from our servers.</p>
        </DialogMolecule>
      </Section>

      <SeparatorAtom />

      {/* Table */}
      <Section title="TableMolecule">
        <TableMolecule>
          <TableCaption>A list of recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>
                  <BadgeAtom variant={statusVariant[inv.status]}>{inv.status}</BadgeAtom>
                </TableCell>
                <TableCell>{inv.method}</TableCell>
                <TableCell className="text-right">{inv.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-medium">Total</TableCell>
              <TableCell className="text-right font-semibold">$750.00</TableCell>
            </TableRow>
          </TableFooter>
        </TableMolecule>
      </Section>

    </div>
  );
};

// Internal layout helper — not exported as a standalone component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <TextAtom as="h2" size="lg" color="default" className="font-semibold">{title}</TextAtom>
    {children}
  </section>
);
