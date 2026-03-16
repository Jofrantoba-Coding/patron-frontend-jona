// UiMenuShowcaseContent.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Renders all showcase sections with anchor ids for scroll navigation.
import React, { useState } from 'react';
import { InterUiMenuShowcase } from './InterUiMenuShowcase';
import { TextAtom } from '../../atoms/TextAtom';
import { SeparatorAtom } from '../../atoms/SeparatorAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { BadgeAtom } from '../../atoms/BadgeAtom';
import { AvatarAtom } from '../../atoms/AvatarAtom';
import { SpinnerAtom } from '../../atoms/SpinnerAtom';
import { ProgressAtom } from '../../atoms/ProgressAtom';
import { SwitchAtom } from '../../atoms/SwitchAtom';
import { AlertMolecule } from '../../molecules/AlertMolecule';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
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
import { TableMolecule, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '../../molecules/TableMolecule';
import { useToastHelpers } from '../../lib/useToast';

// ── Shared data ───────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV001', status: 'Paid',    method: 'Credit Card',   amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal',        amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid',  method: 'Bank Transfer', amount: '$350.00' },
];
const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Paid: 'default', Pending: 'secondary', Unpaid: 'destructive',
};
const ROLE_OPTIONS = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-4 space-y-3">
    <TextAtom as="h2" size="lg" color="default" className="font-semibold">{title}</TextAtom>
    {children}
    <SeparatorAtom className="mt-6" />
  </section>
);

// ── Main content component ────────────────────────────────────────────────────
interface UiMenuShowcaseContentProps extends InterUiMenuShowcase {}

export const UiMenuShowcaseContent: React.FC<UiMenuShowcaseContentProps> = (_props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [page, setPage] = useState(3);
  const [pillTab, setPillTab] = useState('overview');
  const [lineTab, setLineTab] = useState('account');
  const [switchVals, setSwitchVals] = useState({ sm: false, md: true, lg: false, notif: true, sync: false });
  const [progress, setProgress] = useState(65);
  const toggleSwitch = (k: keyof typeof switchVals) => setSwitchVals((v) => ({ ...v, [k]: !v[k] }));
  const { success, error, warning, info } = useToastHelpers();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">

      {/* ── Atoms ── */}
      <Section id="buttons" title="ButtonAtom — variants">
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
        <div className="flex flex-wrap gap-2">
          <ButtonAtom size="sm">Small</ButtonAtom>
          <ButtonAtom size="default">Default</ButtonAtom>
          <ButtonAtom size="lg">Large</ButtonAtom>
        </div>
      </Section>

      <Section id="badges" title="BadgeAtom — variants">
        <div className="flex flex-wrap gap-2">
          <BadgeAtom variant="default">Default</BadgeAtom>
          <BadgeAtom variant="secondary">Secondary</BadgeAtom>
          <BadgeAtom variant="destructive">Destructive</BadgeAtom>
          <BadgeAtom variant="outline">Outline</BadgeAtom>
          <BadgeAtom variant="ghost">Ghost</BadgeAtom>
        </div>
      </Section>

      <Section id="avatars" title="AvatarAtom — sizes + fallback">
        <div className="flex items-end gap-3">
          <AvatarAtom fallback="John Doe" size="xs" />
          <AvatarAtom fallback="John Doe" size="sm" />
          <AvatarAtom fallback="John Doe" size="md" />
          <AvatarAtom fallback="John Doe" size="lg" />
          <AvatarAtom fallback="John Doe" size="xl" />
        </div>
      </Section>

      <Section id="spinner" title="SpinnerAtom — sizes">
        <div className="flex items-center gap-4 text-primary-600">
          <SpinnerAtom size="sm" />
          <SpinnerAtom size="md" />
          <SpinnerAtom size="lg" />
        </div>
      </Section>

      <Section id="progress" title="ProgressAtom — variants + label">
        <div className="space-y-4 max-w-md">
          <ProgressAtom value={progress} label="Upload progress" showLabel />
          <ProgressAtom value={progress} variant="success" label="Storage used" showLabel />
          <ProgressAtom value={progress} variant="danger"  label="CPU usage"   showLabel />
          <ProgressAtom value={progress} variant="warning" label="Memory"      showLabel />
          <div className="flex items-center gap-3">
            <ButtonAtom size="sm" variant="outline" onClick={() => setProgress((v) => Math.max(0, v - 10))}>−10</ButtonAtom>
            <TextAtom size="xs" color="muted">{progress}%</TextAtom>
            <ButtonAtom size="sm" variant="outline" onClick={() => setProgress((v) => Math.min(100, v + 10))}>+10</ButtonAtom>
          </div>
        </div>
      </Section>

      <Section id="skeleton" title="Skeleton presets">
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
      </Section>

      {/* ── Molecules ── */}
      <Section id="alerts" title="AlertMolecule — variants">
        <div className="space-y-3">
          <AlertMolecule title="Information" variant="default">
            This is a default informational alert message.
          </AlertMolecule>
          <AlertMolecule title="Error" variant="destructive">
            Something went wrong. Please try again.
          </AlertMolecule>
        </div>
      </Section>

      <Section id="formfields" title="FormFieldMolecule + SelectField + CheckboxField">
        <CardMolecule>
          <CardHeader>
            <CardTitle>User settings</CardTitle>
            <CardDescription>Update your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFieldMolecule id="msc-name" label="Full name" placeholder="John Doe"
              description="Displayed on your profile." />
            <FormFieldMolecule id="msc-email" label="Email" type="email"
              placeholder="you@example.com" errorMessage="Please enter a valid email." required />
            <SelectFieldMolecule id="msc-role" label="Role" options={ROLE_OPTIONS}
              placeholder="Select a role..." value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              description="Choose the user's access level." />
            <CheckboxFieldMolecule id="msc-terms" label="Accept terms and conditions"
              checked={termsAccepted} onCheckedChange={setTermsAccepted}
              description="By checking this, you agree to our terms of service." />
          </CardContent>
          <CardFooter>
            <ButtonAtom variant="outline">Cancel</ButtonAtom>
            <ButtonAtom>Save changes</ButtonAtom>
          </CardFooter>
        </CardMolecule>
      </Section>

      <Section id="dialog" title="DialogMolecule">
        <ButtonAtom variant="outline" onClick={() => setDialogOpen(true)}>Open Dialog</ButtonAtom>
        <DialogMolecule
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm action"
          description="This action cannot be undone. Are you sure?"
          footer={
            <>
              <ButtonAtom variant="outline" onClick={() => setDialogOpen(false)}>Cancel</ButtonAtom>
              <ButtonAtom variant="destructive" onClick={() => setDialogOpen(false)}>Confirm</ButtonAtom>
            </>
          }
        >
          <p>All associated data will be permanently removed from our servers.</p>
        </DialogMolecule>
      </Section>

      <Section id="table" title="TableMolecule">
        <TableMolecule>
          <TableCaption>Recent invoices</TableCaption>
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
                <TableCell><BadgeAtom variant={statusVariant[inv.status]}>{inv.status}</BadgeAtom></TableCell>
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

      <Section id="tabs" title="TabsMolecule — pill + line">
        <div className="space-y-6">
          <TabsMolecule value={pillTab} onChange={setPillTab} variant="pill">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><CardMolecule><CardContent className="pt-6">
              <TextAtom size="sm">Overview — key metrics and recent activity.</TextAtom>
            </CardContent></CardMolecule></TabsContent>
            <TabsContent value="analytics"><CardMolecule><CardContent className="pt-6">
              <TextAtom size="sm">Analytics — charts and reports.</TextAtom>
            </CardContent></CardMolecule></TabsContent>
            <TabsContent value="settings"><CardMolecule><CardContent className="pt-6">
              <TextAtom size="sm">Settings — preferences and configuration.</TextAtom>
            </CardContent></CardMolecule></TabsContent>
          </TabsMolecule>
          <TabsMolecule value={lineTab} onChange={setLineTab} variant="line">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="pt-4"><TextAtom size="sm">Make changes to your account here.</TextAtom></TabsContent>
            <TabsContent value="password" className="pt-4"><TextAtom size="sm">Change your password here.</TextAtom></TabsContent>
            <TabsContent value="notifications" className="pt-4"><TextAtom size="sm">Manage notification preferences.</TextAtom></TabsContent>
          </TabsMolecule>
        </div>
      </Section>

      <Section id="dropdown" title="DropdownMolecule — groups + shortcuts">
        <div className="flex gap-3 flex-wrap">
          <DropdownMolecule
            trigger={<ButtonAtom variant="outline">My Account ▾</ButtonAtom>}
            groups={[
              { label: 'My Account', items: [
                { label: 'Profile',  shortcut: '⇧⌘P' },
                { label: 'Billing',  shortcut: '⌘B'  },
                { label: 'Settings', shortcut: '⌘S'  },
              ]},
              { items: [{ label: 'Team' }, { label: 'Subscription' }] },
              { items: [{ label: 'Log out', shortcut: '⇧⌘Q', variant: 'destructive' }] },
            ]}
          />
          <DropdownMolecule
            align="end"
            trigger={<ButtonAtom variant="ghost">Actions ▾</ButtonAtom>}
            groups={[
              { items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }] },
              { items: [{ label: 'Delete', variant: 'destructive' }] },
            ]}
          />
        </div>
      </Section>

      <Section id="tooltip" title="TooltipMolecule — sides">
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
      </Section>

      <Section id="switch" title="SwitchAtom + SwitchFieldMolecule">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-6">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <SwitchAtom size={s} checked={switchVals[s]} onCheckedChange={() => toggleSwitch(s)} aria-label={s} />
                <TextAtom size="xs" color="muted">{s}</TextAtom>
              </div>
            ))}
          </div>
          <SwitchFieldMolecule id="sw-notif" label="Enable notifications"
            description="Receive alerts when focus mode changes."
            checked={switchVals.notif} onCheckedChange={() => toggleSwitch('notif')} />
          <SwitchFieldMolecule id="sw-sync" label="Sync across devices"
            description="Focus is shared across all your devices."
            checked={switchVals.sync} onCheckedChange={() => toggleSwitch('sync')} card />
          <SwitchFieldMolecule id="sw-disabled" label="Disabled switch" checked={false} disabled />
        </div>
      </Section>

      <Section id="breadcrumb" title="BreadcrumbMolecule — separator + ellipsis">
        <div className="space-y-4">
          <BreadcrumbMolecule>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink>Components</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </BreadcrumbMolecule>
          <BreadcrumbMolecule>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbLink>Components</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage>Showcase</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </BreadcrumbMolecule>
        </div>
      </Section>

      <Section id="pagination" title="PaginationMolecule">
        <div className="space-y-4">
          <PaginationMolecule currentPage={page} totalPages={10} onPageChange={setPage} />
          <TextAtom size="xs" color="muted">Current page: {page} of 10</TextAtom>
        </div>
      </Section>

      <Section id="toast" title="Toast — success / error / warning / info">
        <div className="flex flex-wrap gap-2">
          <ButtonAtom variant="outline" onClick={() => success('Saved!', 'Your changes have been saved.')}>Success</ButtonAtom>
          <ButtonAtom variant="outline" onClick={() => error('Error', 'Something went wrong.')}>Error</ButtonAtom>
          <ButtonAtom variant="outline" onClick={() => warning('Warning', 'This action may have side effects.')}>Warning</ButtonAtom>
          <ButtonAtom variant="outline" onClick={() => info('Info', 'Your session will expire in 5 minutes.')}>Info</ButtonAtom>
        </div>
      </Section>

    </div>
  );
};
