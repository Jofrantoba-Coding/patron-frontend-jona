export interface ComponentEntry {
  id: string;
  name: string;
  category: 'Atoms' | 'Molecules' | 'Layouts' | 'Organisms' | 'Pages';
  description: string;
  defaultCode: string;
  usage: string;
}

export const COMPONENT_REGISTRY: ComponentEntry[] = [
  // ── ATOMS ──────────────────────────────────────────────────────────────────
  {
    id: 'ButtonAtom',
    name: 'ButtonAtom',
    category: 'Atoms',
    description: 'Versatile button with variants, sizes, loading state and full-width support.',
    defaultCode: `import { ButtonAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <ButtonAtom variant="default">Default</ButtonAtom>
      <ButtonAtom variant="secondary">Secondary</ButtonAtom>
      <ButtonAtom variant="outline">Outline</ButtonAtom>
      <ButtonAtom variant="ghost">Ghost</ButtonAtom>
      <ButtonAtom variant="destructive">Destructive</ButtonAtom>
      <ButtonAtom variant="link">Link</ButtonAtom>
      <ButtonAtom loading>Loading</ButtonAtom>
      <ButtonAtom disabled>Disabled</ButtonAtom>
      <ButtonAtom fullWidth>Full Width</ButtonAtom>
    </div>
  );
}`,
    usage: `import { ButtonAtom } from 'jona-ui';

// Basic usage
<ButtonAtom>Click me</ButtonAtom>

// Variants: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
<ButtonAtom variant="destructive">Delete</ButtonAtom>

// Sizes: "sm" | "md" | "lg"
<ButtonAtom size="lg">Large</ButtonAtom>

// States
<ButtonAtom loading>Saving...</ButtonAtom>
<ButtonAtom disabled>Disabled</ButtonAtom>
<ButtonAtom fullWidth>Full Width</ButtonAtom>

// HTML button type
<ButtonAtom type="submit">Submit</ButtonAtom>`,
  },
  {
    id: 'InputAtom',
    name: 'InputAtom',
    category: 'Atoms',
    description: 'Text input with label, placeholder, error state and multiple types.',
    defaultCode: `import { InputAtom } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [val, setVal] = useState('');
  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm">
      <InputAtom
        id="demo"
        label="Email"
        type="email"
        value={val}
        onChange={(v) => setVal(v)}
        placeholder="you@example.com"
      />
      <InputAtom
        id="err"
        label="With error"
        value=""
        onChange={() => {}}
        errorMessage="This field is required"
      />
      <InputAtom id="dis" label="Disabled" value="read only" onChange={() => {}} disabled />
    </div>
  );
}`,
    usage: `import { InputAtom } from 'jona-ui';

// onChange receives the string value directly (not the event)
<InputAtom
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={(value) => setEmail(value)}
  placeholder="you@example.com"
  errorMessage={emailError}
  required
/>`,
  },
  {
    id: 'BadgeAtom',
    name: 'BadgeAtom',
    category: 'Atoms',
    description: 'Small status badge with color variants.',
    defaultCode: `import { BadgeAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <BadgeAtom variant="default">Default</BadgeAtom>
      <BadgeAtom variant="secondary">Secondary</BadgeAtom>
      <BadgeAtom variant="destructive">Destructive</BadgeAtom>
      <BadgeAtom variant="outline">Outline</BadgeAtom>
    </div>
  );
}`,
    usage: `import { BadgeAtom } from 'jona-ui';

<BadgeAtom variant="secondary">Active</BadgeAtom>`,
  },
  {
    id: 'SpinnerAtom',
    name: 'SpinnerAtom',
    category: 'Atoms',
    description: 'Loading spinner with size variants.',
    defaultCode: `import { SpinnerAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex items-center gap-4 p-4">
      <SpinnerAtom size="sm" />
      <SpinnerAtom size="md" />
      <SpinnerAtom size="lg" />
    </div>
  );
}`,
    usage: `import { SpinnerAtom } from 'jona-ui';

<SpinnerAtom size="md" />`,
  },
  {
    id: 'CheckboxAtom',
    name: 'CheckboxAtom',
    category: 'Atoms',
    description: 'Checkbox input with label and checked state.',
    defaultCode: `import { CheckboxAtom } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="p-4">
      <CheckboxAtom
        id="terms"
        label="Accept terms and conditions"
        checked={checked}
        onChange={(v) => setChecked(v)}
      />
    </div>
  );
}`,
    usage: `import { CheckboxAtom } from 'jona-ui';

<CheckboxAtom
  id="terms"
  label="Accept terms"
  checked={checked}
  onChange={(value) => setChecked(value)}
/>`,
  },
  {
    id: 'SelectAtom',
    name: 'SelectAtom',
    category: 'Atoms',
    description: 'Dropdown select with options array.',
    defaultCode: `import { SelectAtom } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [val, setVal] = useState('');
  return (
    <div className="p-4 max-w-xs">
      <SelectAtom
        id="country"
        label="Country"
        value={val}
        onChange={(v) => setVal(v)}
        options={[
          { value: 'us', label: 'United States' },
          { value: 'mx', label: 'Mexico' },
          { value: 'es', label: 'Spain' },
        ]}
        placeholder="Select a country"
      />
    </div>
  );
}`,
    usage: `import { SelectAtom } from 'jona-ui';

<SelectAtom
  id="role"
  label="Role"
  value={role}
  onChange={(value) => setRole(value)}
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ]}
/>`,
  },
  {
    id: 'AvatarAtom',
    name: 'AvatarAtom',
    category: 'Atoms',
    description: 'User avatar with image or initials fallback.',
    defaultCode: `import { AvatarAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex items-center gap-4 p-4">
      <AvatarAtom name="John Doe" size="sm" />
      <AvatarAtom name="Jane Smith" size="md" />
      <AvatarAtom name="Bob Johnson" size="lg" />
    </div>
  );
}`,
    usage: `import { AvatarAtom } from 'jona-ui';

<AvatarAtom name="John Doe" size="md" src="/avatar.jpg" />`,
  },
  {
    id: 'SwitchAtom',
    name: 'SwitchAtom',
    category: 'Atoms',
    description: 'Toggle switch for boolean settings.',
    defaultCode: `import { SwitchAtom } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [on, setOn] = useState(false);
  return (
    <div className="p-4">
      <SwitchAtom
        id="notifications"
        label="Enable notifications"
        checked={on}
        onChange={(v) => setOn(v)}
      />
    </div>
  );
}`,
    usage: `import { SwitchAtom } from 'jona-ui';

<SwitchAtom
  id="darkMode"
  label="Dark mode"
  checked={darkMode}
  onChange={(value) => setDarkMode(value)}
/>`,
  },
  {
    id: 'TextAtom',
    name: 'TextAtom',
    category: 'Atoms',
    description: 'Typography component with semantic variants.',
    defaultCode: `import { TextAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <TextAtom variant="h1">Heading 1</TextAtom>
      <TextAtom variant="h2">Heading 2</TextAtom>
      <TextAtom variant="h3">Heading 3</TextAtom>
      <TextAtom variant="body">Body text paragraph</TextAtom>
      <TextAtom variant="caption">Caption text</TextAtom>
      <TextAtom variant="muted">Muted text</TextAtom>
    </div>
  );
}`,
    usage: `import { TextAtom } from 'jona-ui';

<TextAtom variant="h2">Section Title</TextAtom>
<TextAtom variant="body">Paragraph content here.</TextAtom>`,
  },
  {
    id: 'ProgressAtom',
    name: 'ProgressAtom',
    category: 'Atoms',
    description: 'Progress bar with percentage value.',
    defaultCode: `import { ProgressAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm">
      <ProgressAtom value={25} />
      <ProgressAtom value={50} />
      <ProgressAtom value={75} />
      <ProgressAtom value={100} />
    </div>
  );
}`,
    usage: `import { ProgressAtom } from 'jona-ui';

<ProgressAtom value={progress} max={100} />`,
  },
  // ── MOLECULES ──────────────────────────────────────────────────────────────
  {
    id: 'CardMolecule',
    name: 'CardMolecule',
    category: 'Molecules',
    description: 'Card container with Header, Content and Footer sub-components.',
    defaultCode: `import {
  CardMolecule, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter,
  ButtonAtom, BadgeAtom
} from 'jona-ui';

export default function Demo() {
  return (
    <div className="p-4 max-w-sm">
      <CardMolecule>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Card Title</CardTitle>
            <BadgeAtom variant="secondary">New</BadgeAtom>
          </div>
          <CardDescription>A short description of the card content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Main content goes here.</p>
        </CardContent>
        <CardFooter className="gap-2">
          <ButtonAtom variant="outline" size="sm">Cancel</ButtonAtom>
          <ButtonAtom size="sm">Confirm</ButtonAtom>
        </CardFooter>
      </CardMolecule>
    </div>
  );
}`,
    usage: `import {
  CardMolecule, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter
} from 'jona-ui';

<CardMolecule className="max-w-sm">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</CardMolecule>`,
  },
  {
    id: 'AlertMolecule',
    name: 'AlertMolecule',
    category: 'Molecules',
    description: 'Alert banner with title, message and severity variants.',
    defaultCode: `import { AlertMolecule } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 p-4 max-w-md">
      <AlertMolecule variant="default" title="Info">
        This is an informational message.
      </AlertMolecule>
      <AlertMolecule variant="destructive" title="Error">
        Something went wrong. Please try again.
      </AlertMolecule>
    </div>
  );
}`,
    usage: `import { AlertMolecule } from 'jona-ui';

<AlertMolecule variant="destructive" title="Error">
  Invalid credentials. Please try again.
</AlertMolecule>`,
  },
  {
    id: 'FormFieldMolecule',
    name: 'FormFieldMolecule',
    category: 'Molecules',
    description: 'Form field combining label, input and error message.',
    defaultCode: `import { FormFieldMolecule } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [email, setEmail] = useState('');
  return (
    <div className="p-4 max-w-sm flex flex-col gap-4">
      <FormFieldMolecule
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(v) => setEmail(v)}
        placeholder="you@example.com"
        required
      />
      <FormFieldMolecule
        id="err"
        label="With validation error"
        value=""
        onChange={() => {}}
        errorMessage="Email is required"
      />
    </div>
  );
}`,
    usage: `import { FormFieldMolecule } from 'jona-ui';

<FormFieldMolecule
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={(value) => setEmail(value)}
  placeholder="you@example.com"
  errorMessage={emailError}
  required
/>`,
  },
  {
    id: 'DialogMolecule',
    name: 'DialogMolecule',
    category: 'Molecules',
    description: 'Modal dialog with trigger, header and footer actions.',
    defaultCode: `import { DialogMolecule, ButtonAtom } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4">
      <ButtonAtom onClick={() => setOpen(true)}>Open Dialog</ButtonAtom>
      <DialogMolecule
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
        footer={
          <div className="flex gap-2 justify-end">
            <ButtonAtom variant="outline" onClick={() => setOpen(false)}>Cancel</ButtonAtom>
            <ButtonAtom variant="destructive" onClick={() => setOpen(false)}>Delete</ButtonAtom>
          </div>
        }
      >
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
      </DialogMolecule>
    </div>
  );
}`,
    usage: `import { DialogMolecule } from 'jona-ui';

<DialogMolecule
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm"
  description="Are you sure?"
  footer={<ButtonAtom onClick={() => setOpen(false)}>Close</ButtonAtom>}
>
  Dialog content here
</DialogMolecule>`,
  },
  {
    id: 'UserAvatarMolecule',
    name: 'UserAvatarMolecule',
    category: 'Molecules',
    description: 'User card combining avatar, name and email.',
    defaultCode: `import { UserAvatarMolecule } from 'jona-ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <UserAvatarMolecule name="John Doe" email="john@example.com" size="sm" />
      <UserAvatarMolecule name="Jane Smith" email="jane@example.com" size="md" />
      <UserAvatarMolecule name="Bob Johnson" email="bob@example.com" size="lg" />
    </div>
  );
}`,
    usage: `import { UserAvatarMolecule } from 'jona-ui';

<UserAvatarMolecule
  name="John Doe"
  email="john@example.com"
  size="lg"
/>`,
  },
  {
    id: 'TabsMolecule',
    name: 'TabsMolecule',
    category: 'Molecules',
    description: 'Tabbed navigation with content panels.',
    defaultCode: `import { TabsMolecule } from 'jona-ui';

export default function Demo() {
  return (
    <div className="p-4 max-w-md">
      <TabsMolecule
        tabs={[
          { id: 'overview', label: 'Overview', content: <p className="p-2 text-sm">Overview content here.</p> },
          { id: 'settings', label: 'Settings', content: <p className="p-2 text-sm">Settings content here.</p> },
          { id: 'logs', label: 'Logs', content: <p className="p-2 text-sm">Logs content here.</p> },
        ]}
      />
    </div>
  );
}`,
    usage: `import { TabsMolecule } from 'jona-ui';

<TabsMolecule
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  ]}
/>`,
  },
  {
    id: 'PaginationMolecule',
    name: 'PaginationMolecule',
    category: 'Molecules',
    description: 'Pagination controls with page navigation.',
    defaultCode: `import { PaginationMolecule } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [page, setPage] = useState(1);
  return (
    <div className="p-4">
      <p className="text-sm mb-3 text-gray-600">Current page: {page}</p>
      <PaginationMolecule
        currentPage={page}
        totalPages={10}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}`,
    usage: `import { PaginationMolecule } from 'jona-ui';

<PaginationMolecule
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(p) => setPage(p)}
/>`,
  },
  // ── LAYOUTS ────────────────────────────────────────────────────────────────
  {
    id: 'BorderLayout',
    name: 'BorderLayout',
    category: 'Layouts',
    description: 'Classic border layout with north, south, east, west and center regions.',
    defaultCode: `import { BorderLayout } from 'jona-ui';

export default function Demo() {
  return (
    <div className="h-96 border rounded overflow-hidden">
      <BorderLayout
        north={<div className="bg-blue-600 text-white px-4 py-2 font-semibold">Header</div>}
        south={<div className="bg-gray-100 text-gray-500 px-4 py-2 text-sm text-center">Footer</div>}
        west={<div className="bg-gray-50 border-r px-3 py-4 text-sm font-medium">Sidebar</div>}
        center={
          <div className="p-4 text-sm text-gray-600">
            Main content area. This is the center region of the BorderLayout.
          </div>
        }
      />
    </div>
  );
}`,
    usage: `import { BorderLayout } from 'jona-ui';

<BorderLayout
  north={<Header />}
  south={<Footer />}
  west={<Sidebar />}
  east={<Panel />}
  center={<MainContent />}
/>`,
  },
  // ── ORGANISMS ──────────────────────────────────────────────────────────────
  {
    id: 'LoginOrganism',
    name: 'LoginOrganism',
    category: 'Organisms',
    description: 'Complete login form organism with email, password, validation and action buttons.',
    defaultCode: `import { LoginOrganism } from 'jona-ui';
import { useState } from 'react';

export default function Demo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert(\`Login: \${email}\`);
  }

  return (
    <div className="min-h-96 flex items-center justify-center bg-gray-50 p-4">
      <LoginOrganism
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        onGoToCreateAccount={() => alert('Go to register')}
        onGoToRecoverPassword={() => alert('Go to recover')}
      />
    </div>
  );
}`,
    usage: `import { LoginOrganism } from 'jona-ui';

<LoginOrganism
  email={email}
  password={password}
  setEmail={setEmail}
  setPassword={setPassword}
  onSubmit={handleSubmit}
  emailError={emailError}
  passwordError={passwordError}
  alertMessage={alertMessage}
  isLoading={isLoading}
  onGoToCreateAccount={() => navigate('/register')}
  onGoToRecoverPassword={() => navigate('/recover')}
/>`,
  },
  {
    id: 'HeaderPageOrganism',
    name: 'HeaderPageOrganism',
    category: 'Organisms',
    description: 'Page header organism with title, navigation and actions slots.',
    defaultCode: `import { HeaderPageOrganism, ButtonAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="w-full border rounded overflow-hidden">
      <HeaderPageOrganism
        title="My App"
        nav={
          <>
            <a href="#" className="hover:text-blue-600 text-sm">Home</a>
            <a href="#" className="hover:text-blue-600 text-sm">Docs</a>
            <a href="#" className="hover:text-blue-600 text-sm">Components</a>
          </>
        }
        actions={
          <ButtonAtom size="sm" variant="outline">Sign in</ButtonAtom>
        }
      />
    </div>
  );
}`,
    usage: `import { HeaderPageOrganism } from 'jona-ui';

<HeaderPageOrganism
  title="My App"
  nav={<nav>...</nav>}
  actions={<UserAvatarMolecule name="John Doe" />}
/>`,
  },
  {
    id: 'FooterPageOrganism',
    name: 'FooterPageOrganism',
    category: 'Organisms',
    description: 'Page footer organism with left, center and right slots.',
    defaultCode: `import { FooterPageOrganism, BadgeAtom } from 'jona-ui';

export default function Demo() {
  return (
    <div className="w-full border rounded overflow-hidden">
      <FooterPageOrganism
        text="© 2026 My Company"
        center={
          <>
            <a href="#" className="hover:text-blue-600 text-sm">Privacy</a>
            <a href="#" className="hover:text-blue-600 text-sm">Terms</a>
            <a href="#" className="hover:text-blue-600 text-sm">Contact</a>
          </>
        }
        right={<BadgeAtom variant="secondary">v1.0.0</BadgeAtom>}
      />
    </div>
  );
}`,
    usage: `import { FooterPageOrganism } from 'jona-ui';

<FooterPageOrganism
  text="© 2026 My Company"
  left={<Logo />}
  center={<FooterLinks />}
  right={<SocialIcons />}
/>`,
  },
  // ── PAGES ──────────────────────────────────────────────────────────────────
  {
    id: 'UiHomeLogin',
    name: 'UiHomeLogin',
    category: 'Pages',
    description: 'Full login page combining BorderLayout + LoginOrganism with built-in state management.',
    defaultCode: `import { UiHomeLogin } from 'jona-ui';

export default function Demo() {
  return (
    <div className="h-screen">
      <UiHomeLogin
        appTitle="My App"
        footerText="© 2026 My Company"
        onLogin={async (email, password) => {
          await new Promise(r => setTimeout(r, 1000));
          alert(\`Logged in as \${email}\`);
        }}
        onGoToCreateAccount={() => alert('Register')}
        onGoToRecoverPassword={() => alert('Recover')}
      />
    </div>
  );
}`,
    usage: `import { UiHomeLogin } from 'jona-ui';

// UiHomeLogin manages its own email/password state internally.
// Just provide the async onLogin handler.
<UiHomeLogin
  appTitle="My App"
  footerText="© 2026 My Company"
  onLogin={async (email, password) => {
    const token = await authService.login(email, password);
    localStorage.setItem('token', token);
    navigate('/dashboard');
  }}
  onGoToCreateAccount={() => navigate('/register')}
  onGoToRecoverPassword={() => navigate('/recover')}
/>`,
  },
];

export const CATEGORIES = ['Atoms', 'Molecules', 'Layouts', 'Organisms', 'Pages'] as const;
