import React, { useState } from 'react';
import {
  ButtonAtom, InputAtom, BadgeAtom, SpinnerAtom, CheckboxAtom,
  SelectAtom, AvatarAtom, SwitchAtom, TextAtom, ProgressAtom,
  CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  AlertMolecule, FormFieldMolecule, DialogMolecule, UserAvatarMolecule,
  TabsMolecule, TabsList, TabsTrigger, TabsContent,
  PaginationMolecule, BorderLayout, LoginOrganism, UiHomeLogin,
  HeaderPageOrganism, FooterPageOrganism,
  RecoverPasswordOrganism, UiHomeRecoverPassword,
  CreateAccountOrganism, UiHomeCreateAccount,
} from 'jona-ui';

// ── Atoms ──────────────────────────────────────────────────────────────────

export const ButtonAtomPreview = () => (
  <div className="flex flex-wrap gap-3">
    <ButtonAtom variant="default">Default</ButtonAtom>
    <ButtonAtom variant="secondary">Secondary</ButtonAtom>
    <ButtonAtom variant="outline">Outline</ButtonAtom>
    <ButtonAtom variant="ghost">Ghost</ButtonAtom>
    <ButtonAtom variant="destructive">Destructive</ButtonAtom>
    <ButtonAtom variant="link">Link</ButtonAtom>
    <ButtonAtom loading>Loading</ButtonAtom>
    <ButtonAtom disabled>Disabled</ButtonAtom>
  </div>
);

export const InputAtomPreview = () => {
  const [val, setVal] = useState('');
  return (
    <div className="flex flex-col gap-3 w-72">
      <InputAtom
        id="d1"
        type="email"
        value={val}
        onChange={(v) => setVal(v)}
        placeholder="you@example.com"
      />
      <InputAtom
        id="d2"
        value=""
        onChange={() => {}}
        hasError
        placeholder="Field with error"
      />
    </div>
  );
};

export const BadgeAtomPreview = () => (
  <div className="flex flex-wrap gap-2">
    <BadgeAtom variant="default">Default</BadgeAtom>
    <BadgeAtom variant="secondary">Secondary</BadgeAtom>
    <BadgeAtom variant="destructive">Destructive</BadgeAtom>
    <BadgeAtom variant="outline">Outline</BadgeAtom>
  </div>
);

export const SpinnerAtomPreview = () => (
  <div className="flex items-center gap-4">
    <SpinnerAtom size="sm" />
    <SpinnerAtom size="md" />
    <SpinnerAtom size="lg" />
  </div>
);

export const CheckboxAtomPreview = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <CheckboxAtom checked={checked} onCheckedChange={setChecked} />
      <span className="text-sm">Accept terms and conditions</span>
    </div>
  );
};

export const SelectAtomPreview = () => {
  const [val, setVal] = useState('');
  return (
    <div className="w-64">
      <SelectAtom
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
};

export const AvatarAtomPreview = () => (
  <div className="flex items-center gap-4">
    <AvatarAtom initials="JD" size="sm" />
    <AvatarAtom initials="JS" size="md" />
    <AvatarAtom initials="BJ" size="lg" />
  </div>
);

export const SwitchAtomPreview = () => {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <SwitchAtom checked={on} onCheckedChange={setOn} />
      <span className="text-sm">Enable notifications</span>
    </div>
  );
};

export const TextAtomPreview = () => (
  <div className="flex flex-col gap-2">
    <TextAtom as="h1" size="2xl">Heading 1</TextAtom>
    <TextAtom as="h2" size="xl">Heading 2</TextAtom>
    <TextAtom as="h3" size="lg">Heading 3</TextAtom>
    <TextAtom as="p" size="base">Body text paragraph</TextAtom>
    <TextAtom as="p" size="sm" color="muted">Muted text</TextAtom>
    <TextAtom as="span" size="xs" color="muted">Caption text</TextAtom>
  </div>
);

export const ProgressAtomPreview = () => (
  <div className="flex flex-col gap-3 w-64">
    <ProgressAtom value={25} />
    <ProgressAtom value={50} />
    <ProgressAtom value={75} />
    <ProgressAtom value={100} />
  </div>
);

// ── Molecules ──────────────────────────────────────────────────────────────

export const CardMoleculePreview = () => (
  <div className="w-72">
    <CardMolecule>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Card Title</CardTitle>
          <BadgeAtom variant="secondary">New</BadgeAtom>
        </div>
        <CardDescription>A short description of the card content.</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-gray-600">Main content goes here.</p></CardContent>
      <CardFooter className="gap-2">
        <ButtonAtom variant="outline" size="sm">Cancel</ButtonAtom>
        <ButtonAtom size="sm">Confirm</ButtonAtom>
      </CardFooter>
    </CardMolecule>
  </div>
);

export const AlertMoleculePreview = () => (
  <div className="flex flex-col gap-3 w-96">
    <AlertMolecule variant="default" title="Info">This is an informational message.</AlertMolecule>
    <AlertMolecule variant="destructive" title="Error">Something went wrong. Please try again.</AlertMolecule>
  </div>
);

export const FormFieldMoleculePreview = () => {
  const [email, setEmail] = useState('');
  return (
    <div className="flex flex-col gap-3 w-72">
      <FormFieldMolecule
        id="ff1"
        label="Email"
        type="email"
        value={email}
        onChange={(v) => setEmail(v)}
        placeholder="you@example.com"
        required
      />
      <FormFieldMolecule
        id="ff2"
        label="With error"
        value=""
        onChange={() => {}}
        errorMessage="Email is required"
      />
    </div>
  );
};

export const DialogMoleculePreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
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
};

export const UserAvatarMoleculePreview = () => (
  <div className="flex flex-col gap-3">
    <UserAvatarMolecule name="John Doe" email="john@example.com" size="sm" />
    <UserAvatarMolecule name="Jane Smith" email="jane@example.com" size="md" />
    <UserAvatarMolecule name="Bob Johnson" email="bob@example.com" size="lg" />
  </div>
);

export const TabsMoleculePreview = () => (
  <div className="w-96">
    <TabsMolecule value="overview" onChange={() => {}}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><p className="p-2 text-sm">Overview content.</p></TabsContent>
      <TabsContent value="settings"><p className="p-2 text-sm">Settings content.</p></TabsContent>
      <TabsContent value="logs"><p className="p-2 text-sm">Logs content.</p></TabsContent>
    </TabsMolecule>
  </div>
);

export const PaginationMoleculePreview = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p className="text-sm mb-3 text-gray-600">Page: {page}</p>
      <PaginationMolecule currentPage={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
};

// ── Layouts ────────────────────────────────────────────────────────────────

export const BorderLayoutPreview = () => (
  <div className="w-full h-64 border rounded overflow-hidden">
    <BorderLayout
      north={<div className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">Header</div>}
      south={<div className="bg-gray-100 text-gray-500 px-4 py-1.5 text-xs text-center">Footer</div>}
      west={<div className="bg-gray-50 border-r px-3 py-3 text-xs font-medium w-24">Sidebar</div>}
      center={<div className="p-3 text-sm text-gray-600">Center content area</div>}
    />
  </div>
);

// ── Organisms ──────────────────────────────────────────────────────────────

export const LoginOrganismPreview = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="w-full">
      <LoginOrganism
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={(e) => { e.preventDefault(); alert(`Login: ${email}`); }}
        onGoToCreateAccount={() => alert('Register')}
        onGoToRecoverPassword={() => alert('Recover')}
      />
    </div>
  );
};

export const HeaderPageOrganismPreview = () => (
  <div className="w-full border rounded overflow-hidden">
    <HeaderPageOrganism
      title="JONA UI"
      nav={
        <>
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Docs</a>
          <a href="#" className="hover:text-blue-600">Components</a>
        </>
      }
      actions={
        <ButtonAtom size="sm" variant="outline">Sign in</ButtonAtom>
      }
    />
  </div>
);

export const FooterPageOrganismPreview = () => (
  <div className="w-full border rounded overflow-hidden">
    <FooterPageOrganism
      text="© 2026 JONA UI"
      center={
        <>
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </>
      }
      right={<BadgeAtom variant="secondary">v1.1.1</BadgeAtom>}
    />
  </div>
);

export const RecoverPasswordOrganismPreview = () => {
  const [email, setEmail] = useState('');
  return (
    <div className="w-full">
      <RecoverPasswordOrganism
        email={email}
        setEmail={setEmail}
        onSubmit={(e) => { e.preventDefault(); alert(`Reset link sent to: ${email}`); }}
        onGoToLogin={() => alert('Back to login')}
      />
    </div>
  );
};

export const CreateAccountOrganismPreview = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <div className="w-full">
      <CreateAccountOrganism
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={(e) => { e.preventDefault(); alert(`Account created: ${email}`); }}
        onGoToLogin={() => alert('Back to login')}
      />
    </div>
  );
};

// ── Pages ──────────────────────────────────────────────────────────────────

export const UiHomeLoginPreview = () => (
  <div className="w-full h-full min-h-screen">
    <UiHomeLogin
      appTitle="My App"
      footerText="© 2026 My Company"
      onLogin={async (email) => {
        await new Promise(r => setTimeout(r, 800));
        alert(`Logged in: ${email}`);
      }}
      onGoToCreateAccount={() => alert('Register')}
      onGoToRecoverPassword={() => alert('Recover')}
    />
  </div>
);

export const UiHomeRecoverPasswordPreview = () => (
  <div className="w-full h-full min-h-screen">
    <UiHomeRecoverPassword
      appTitle="My App"
      footerText="© 2026 My Company"
      onRecover={async (email) => {
        await new Promise(r => setTimeout(r, 800));
        alert(`Reset link sent to: ${email}`);
      }}
      onGoToLogin={() => alert('Back to login')}
    />
  </div>
);

export const UiHomeCreateAccountPreview = () => (
  <div className="w-full h-full min-h-screen">
    <UiHomeCreateAccount
      appTitle="My App"
      footerText="© 2026 My Company"
      onCreateAccount={async (name, email) => {
        await new Promise(r => setTimeout(r, 800));
        alert(`Account created for: ${name} (${email})`);
      }}
      onGoToLogin={() => alert('Back to login')}
    />
  </div>
);

// ── Registry map ───────────────────────────────────────────────────────────

export const PREVIEW_MAP: Record<string, React.FC> = {
  ButtonAtom: ButtonAtomPreview,
  InputAtom: InputAtomPreview,
  BadgeAtom: BadgeAtomPreview,
  SpinnerAtom: SpinnerAtomPreview,
  CheckboxAtom: CheckboxAtomPreview,
  SelectAtom: SelectAtomPreview,
  AvatarAtom: AvatarAtomPreview,
  SwitchAtom: SwitchAtomPreview,
  TextAtom: TextAtomPreview,
  ProgressAtom: ProgressAtomPreview,
  CardMolecule: CardMoleculePreview,
  AlertMolecule: AlertMoleculePreview,
  FormFieldMolecule: FormFieldMoleculePreview,
  DialogMolecule: DialogMoleculePreview,
  UserAvatarMolecule: UserAvatarMoleculePreview,
  TabsMolecule: TabsMoleculePreview,
  PaginationMolecule: PaginationMoleculePreview,
  BorderLayout: BorderLayoutPreview,
  LoginOrganism: LoginOrganismPreview,
  HeaderPageOrganism: HeaderPageOrganismPreview,
  FooterPageOrganism: FooterPageOrganismPreview,
  RecoverPasswordOrganism: RecoverPasswordOrganismPreview,
  CreateAccountOrganism: CreateAccountOrganismPreview,
  UiHomeLogin: UiHomeLoginPreview,
  UiHomeRecoverPassword: UiHomeRecoverPasswordPreview,
  UiHomeCreateAccount: UiHomeCreateAccountPreview,
};
