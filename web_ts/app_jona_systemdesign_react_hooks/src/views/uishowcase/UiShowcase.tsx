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
import { TabsMolecule, TabsList, TabsTrigger, TabsContent } from '../../molecules/TabsMolecule';
import { DropdownMolecule } from '../../molecules/DropdownMolecule';
import { PaginationMolecule } from '../../molecules/PaginationMolecule';
import { TooltipMolecule } from '../../molecules/TooltipMolecule';
import { SwitchFieldMolecule } from '../../molecules/SwitchFieldMolecule';
import { BreadcrumbMolecule, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from '../../molecules/BreadcrumbMolecule';
import { SkeletonUserRow, SkeletonCard, SkeletonTableRows, SkeletonForm } from '../../molecules/SkeletonPresets';
import { ProgressAtom } from '../../atoms/ProgressAtom';
import { SwitchAtom } from '../../atoms/SwitchAtom';
import {
  TableMolecule, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from '../../molecules/TableMolecule';
import { useToastHelpers } from '../../lib/useToast';

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

      <SeparatorAtom />

      {/* Tooltip */}
      <Section title="TooltipMolecule — sides">
        <TooltipShowcase />
      </Section>

      <SeparatorAtom />

      {/* Switch */}
      <Section title="SwitchAtom + SwitchFieldMolecule — sizes + card style">
        <SwitchShowcase />
      </Section>

      <SeparatorAtom />

      {/* Progress */}
      <Section title="ProgressAtom — variants + label">
        <ProgressShowcase />
      </Section>

      <SeparatorAtom />

      {/* Skeleton */}
      <Section title="Skeleton presets — user row / card / table / form">
        <SkeletonShowcase />
      </Section>

      <SeparatorAtom />

      {/* Breadcrumb */}
      <Section title="BreadcrumbMolecule — separator + ellipsis">
        <BreadcrumbShowcase />
      </Section>

      <SeparatorAtom />

      {/* Tabs */}
      <Section title="TabsMolecule — pill + line variants">
        <div className="space-y-6">
          <TabsShowcase />
        </div>
      </Section>

      <SeparatorAtom />

      {/* Dropdown */}
      <Section title="DropdownMolecule — groups + shortcuts + destructive">
        <DropdownShowcase />
      </Section>

      <SeparatorAtom />

      {/* Toast */}
      <Section title="Toast — success / error / warning / info">
        <ToastShowcase />
      </Section>

      <SeparatorAtom />

      {/* Pagination */}
      <Section title="PaginationMolecule">
        <PaginationShowcase />
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

// ── Tabs showcase ─────────────────────────────────────────────────────────────
const TabsShowcase: React.FC = () => {
  const [pillTab, setPillTab] = useState('overview');
  const [lineTab, setLineTab] = useState('account');

  return (
    <div className="space-y-6">
      {/* Pill variant */}
      <TabsMolecule value={pillTab} onChange={setPillTab} variant="pill">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <CardMolecule><CardContent className="pt-6">
            <TextAtom size="sm">Overview content — key metrics and recent activity.</TextAtom>
          </CardContent></CardMolecule>
        </TabsContent>
        <TabsContent value="analytics">
          <CardMolecule><CardContent className="pt-6">
            <TextAtom size="sm">Analytics content — charts and reports.</TextAtom>
          </CardContent></CardMolecule>
        </TabsContent>
        <TabsContent value="settings">
          <CardMolecule><CardContent className="pt-6">
            <TextAtom size="sm">Settings content — preferences and configuration.</TextAtom>
          </CardContent></CardMolecule>
        </TabsContent>
      </TabsMolecule>

      {/* Line variant */}
      <TabsMolecule value={lineTab} onChange={setLineTab} variant="line">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="pt-4">
          <TextAtom size="sm">Make changes to your account here.</TextAtom>
        </TabsContent>
        <TabsContent value="password" className="pt-4">
          <TextAtom size="sm">Change your password here.</TextAtom>
        </TabsContent>
        <TabsContent value="notifications" className="pt-4">
          <TextAtom size="sm">Manage your notification preferences.</TextAtom>
        </TabsContent>
      </TabsMolecule>
    </div>
  );
};

// ── Dropdown showcase ─────────────────────────────────────────────────────────
const DropdownShowcase: React.FC = () => (
  <div className="flex gap-3 flex-wrap">
    <DropdownMolecule
      trigger={<ButtonAtom variant="outline">My Account ▾</ButtonAtom>}
      groups={[
        {
          label: 'My Account',
          items: [
            { label: 'Profile',  shortcut: '⇧⌘P' },
            { label: 'Billing',  shortcut: '⌘B'  },
            { label: 'Settings', shortcut: '⌘S'  },
          ],
        },
        {
          items: [
            { label: 'Team' },
            { label: 'Subscription' },
          ],
        },
        {
          items: [
            { label: 'Log out', shortcut: '⇧⌘Q', variant: 'destructive' },
          ],
        },
      ]}
    />
    <DropdownMolecule
      align="end"
      trigger={<ButtonAtom variant="ghost">Actions ▾</ButtonAtom>}
      groups={[
        {
          items: [
            { label: 'Edit'      },
            { label: 'Duplicate' },
            { label: 'Archive'   },
          ],
        },
        {
          items: [
            { label: 'Delete', variant: 'destructive' },
          ],
        },
      ]}
    />
  </div>
);

// ── Toast showcase ────────────────────────────────────────────────────────────
const ToastShowcase: React.FC = () => {
  const { success, error, warning, info } = useToastHelpers();
  return (
    <div className="flex flex-wrap gap-2">
      <ButtonAtom variant="outline" onClick={() => success('Saved!', 'Your changes have been saved.')}>
        Success toast
      </ButtonAtom>
      <ButtonAtom variant="outline" onClick={() => error('Error', 'Something went wrong. Please try again.')}>
        Error toast
      </ButtonAtom>
      <ButtonAtom variant="outline" onClick={() => warning('Warning', 'This action may have side effects.')}>
        Warning toast
      </ButtonAtom>
      <ButtonAtom variant="outline" onClick={() => info('Info', 'Your session will expire in 5 minutes.')}>
        Info toast
      </ButtonAtom>
    </div>
  );
};

// ── Pagination showcase ───────────────────────────────────────────────────────
const PaginationShowcase: React.FC = () => {
  const [page, setPage] = useState(3);
  return (
    <div className="space-y-4">
      <PaginationMolecule currentPage={page} totalPages={10} onPageChange={setPage} />
      <TextAtom size="xs" color="muted">Current page: {page} of 10</TextAtom>
    </div>
  );
};

// ── Tooltip showcase ──────────────────────────────────────────────────────────
const TooltipShowcase: React.FC = () => (
  <div className="flex flex-wrap gap-4">
    {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
      <TooltipMolecule key={side} content={`Tooltip on ${side}`} side={side}>
        <ButtonAtom variant="outline" size="sm">{side}</ButtonAtom>
      </TooltipMolecule>
    ))}
    <TooltipMolecule content={<span>Shortcut: <kbd className="bg-neutral-700 px-1 rounded text-xs">⌘K</kbd></span>} side="top">
      <ButtonAtom variant="ghost" size="sm">With shortcut</ButtonAtom>
    </TooltipMolecule>
  </div>
);

// ── Switch showcase ───────────────────────────────────────────────────────────
const SwitchShowcase: React.FC = () => {
  const [vals, setVals] = useState({ sm: false, md: true, lg: false, notif: true, sync: false });
  const toggle = (k: keyof typeof vals) => setVals((v) => ({ ...v, [k]: !v[k] }));
  return (
    <div className="space-y-4 max-w-sm">
      {/* Sizes */}
      <div className="flex items-center gap-6">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <SwitchAtom size={s} checked={vals[s]} onCheckedChange={() => toggle(s)} aria-label={s} />
            <TextAtom size="xs" color="muted">{s}</TextAtom>
          </div>
        ))}
      </div>
      {/* Field */}
      <SwitchFieldMolecule
        id="sw-notif"
        label="Enable notifications"
        description="Receive alerts when focus mode changes."
        checked={vals.notif}
        onCheckedChange={() => toggle('notif')}
      />
      {/* Card style */}
      <SwitchFieldMolecule
        id="sw-sync"
        label="Sync across devices"
        description="Focus is shared across all your devices."
        checked={vals.sync}
        onCheckedChange={() => toggle('sync')}
        card
      />
      {/* Disabled */}
      <SwitchFieldMolecule
        id="sw-disabled"
        label="Disabled switch"
        checked={false}
        disabled
      />
    </div>
  );
};

// ── Progress showcase ─────────────────────────────────────────────────────────
const ProgressShowcase: React.FC = () => {
  const [val, setVal] = useState(65);
  return (
    <div className="space-y-4 max-w-md">
      <ProgressAtom value={val} label="Upload progress" showLabel />
      <ProgressAtom value={val} variant="success" label="Storage used" showLabel />
      <ProgressAtom value={val} variant="danger"  label="CPU usage"   showLabel />
      <ProgressAtom value={val} variant="warning" label="Memory"      showLabel />
      <div className="flex items-center gap-3">
        <ButtonAtom size="sm" variant="outline" onClick={() => setVal((v) => Math.max(0, v - 10))}>−10</ButtonAtom>
        <TextAtom size="xs" color="muted">{val}%</TextAtom>
        <ButtonAtom size="sm" variant="outline" onClick={() => setVal((v) => Math.min(100, v + 10))}>+10</ButtonAtom>
      </div>
    </div>
  );
};

// ── Skeleton showcase ─────────────────────────────────────────────────────────
const SkeletonShowcase: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <TextAtom size="xs" color="muted">User row</TextAtom>
      <SkeletonUserRow />
    </div>
    <div className="space-y-2">
      <TextAtom size="xs" color="muted">Card</TextAtom>
      <SkeletonCard />
    </div>
    <div className="space-y-2">
      <TextAtom size="xs" color="muted">Table rows</TextAtom>
      <SkeletonTableRows rows={3} cols={4} />
    </div>
    <div className="space-y-2">
      <TextAtom size="xs" color="muted">Form</TextAtom>
      <SkeletonForm fields={2} />
    </div>
  </div>
);

// ── Breadcrumb showcase ───────────────────────────────────────────────────────
const BreadcrumbShowcase: React.FC = () => (
  <div className="space-y-4">
    {/* Basic */}
    <BreadcrumbMolecule>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink>Components</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbMolecule>

    {/* Custom separator */}
    <BreadcrumbMolecule>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink>Design System</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Showcase</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbMolecule>

    {/* With ellipsis */}
    <BreadcrumbMolecule>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink>Components</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbMolecule>
  </div>
);
