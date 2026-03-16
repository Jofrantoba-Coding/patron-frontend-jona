// ThemingGuideView.tsx — JONA View (render puro)
import React from 'react';

const Code: React.FC<{ children: string; lang?: string }> = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 overflow-x-auto whitespace-pre font-mono leading-relaxed">
    {children}
  </pre>
);

const InlineCode: React.FC<{ children: string }> = ({ children }) => (
  <code className="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">{title}</h2>
    {children}
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

export const ThemingGuideView: React.FC = () => (
  <div className="max-w-3xl mx-auto px-6 py-8 text-gray-700">

    {/* Header */}
    <div className="mb-8">
      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Guide</span>
      <h1 className="text-2xl font-bold text-gray-900 mt-2">Theming & Setup</h1>
      <p className="text-gray-500 mt-1">
        How to install <InlineCode>jona-ui</InlineCode>, apply the default styles, and customize the theme at every level of the design system.
      </p>
    </div>

    {/* 1. Installation */}
    <Section title="1. Installation">
      <SubSection title="Install the package">
        <Code>{`npm install jona-ui`}</Code>
      </SubSection>

      <SubSection title="Import the compiled CSS (required)">
        <p className="text-sm mb-2">
          Add this import once in your app entry point (e.g. <InlineCode>main.tsx</InlineCode> or <InlineCode>_app.tsx</InlineCode>).
          This single file includes the design tokens and all component styles — no Tailwind configuration needed.
        </p>
        <Code>{`// main.tsx
import 'jona-ui/index.css';`}</Code>
      </SubSection>

      <SubSection title="That's it — use any component">
        <Code>{`import { ButtonAtom } from 'jona-ui';

export default function App() {
  return <ButtonAtom variant="default">Hello JONA</ButtonAtom>;
}`}</Code>
      </SubSection>
    </Section>

    {/* 2. How the theme works */}
    <Section title="2. How the theme works">
      <p className="text-sm mb-4">
        All component styles are driven by <strong>CSS custom properties</strong> (variables) defined in <InlineCode>:root</InlineCode>.
        Tailwind classes like <InlineCode>text-primary-600</InlineCode> or <InlineCode>border-neutral-200</InlineCode> resolve to these variables at runtime.
      </p>
      <p className="text-sm mb-4">
        This means you can override any color, radius or shadow by redefining the variable — no rebuild required.
      </p>
      <Code>{`:root {
  /* Primary palette (RGB triplets — no commas) */
  --jona-primary-50:  239 246 255;
  --jona-primary-500: 59  130 246;
  --jona-primary-600: 37  99  235;   /* main brand color */

  /* Neutral palette */
  --jona-neutral-200: 226 232 240;
  --jona-neutral-600: 71  85  105;

  /* Danger / Success / Warning */
  --jona-danger-500:  239 68  68;
  --jona-success-500: 34  197 94;
  --jona-warning-500: 234 179 8;

  /* Border radius */
  --jona-radius:    0.375rem;
  --jona-radius-lg: 0.75rem;
}`}</Code>
    </Section>

    {/* 3. Customizing the theme */}
    <Section title="3. Customizing the theme">
      <SubSection title="Option A — Override CSS variables (recommended)">
        <p className="text-sm mb-2">
          Override variables in your own CSS file after importing <InlineCode>jona-ui/index.css</InlineCode>.
          All components update automatically.
        </p>
        <Code>{`/* your-app.css */
:root {
  /* Change brand to green */
  --jona-primary-500: 34  197 94;
  --jona-primary-600: 22  163 74;

  /* Rounder corners */
  --jona-radius:    0.5rem;
  --jona-radius-lg: 1rem;
}`}</Code>
      </SubSection>

      <SubSection title="Option B — JonaThemeProvider (runtime theming)">
        <p className="text-sm mb-2">
          Use <InlineCode>JonaThemeProvider</InlineCode> to apply a theme object at runtime — useful for multi-tenant apps or dark mode.
        </p>
        <Code>{`import { JonaThemeProvider } from 'jona-ui/theme';

const myTheme = {
  primary600: '22 163 74',   // green-600
  primary500: '34 197 94',   // green-500
};

export default function App() {
  return (
    <JonaThemeProvider theme={myTheme}>
      <YourApp />
    </JonaThemeProvider>
  );
}`}</Code>
      </SubSection>
    </Section>

    {/* 4. Overriding styles per level */}
    <Section title="4. Overriding styles per level">

      <SubSection title="Atom — className prop">
        <p className="text-sm mb-2">
          Every atom accepts a <InlineCode>className</InlineCode> prop. Use Tailwind utilities to override or extend styles.
        </p>
        <Code>{`// Override button color
<ButtonAtom className="bg-green-600 hover:bg-green-700">
  Custom Button
</ButtonAtom>

// Override input border
<InputAtom
  id="name"
  value={name}
  onChange={setName}
  className="border-purple-400 focus:ring-purple-500"
/>`}</Code>
      </SubSection>

      <SubSection title="Molecule — className + slot props">
        <p className="text-sm mb-2">
          Molecules expose <InlineCode>className</InlineCode> and sometimes slot props for inner sections.
        </p>
        <Code>{`// Override card shadow and border
<CardMolecule className="shadow-xl border-blue-200">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</CardMolecule>

// Override alert colors
<AlertMolecule
  variant="default"
  title="Custom"
  className="bg-purple-50 border-purple-300 text-purple-800"
>
  Custom styled alert
</AlertMolecule>`}</Code>
      </SubSection>

      <SubSection title="Layout — className on regions">
        <p className="text-sm mb-2">
          <InlineCode>BorderLayout</InlineCode> accepts <InlineCode>className</InlineCode> on the container and each region slot.
        </p>
        <Code>{`<BorderLayout
  className="rounded-xl overflow-hidden shadow-lg"
  north={
    <div className="bg-indigo-700 text-white px-4 py-3">
      Custom Header
    </div>
  }
  center={<MainContent />}
/>`}</Code>
      </SubSection>

      <SubSection title="Organism — className + slot props">
        <p className="text-sm mb-2">
          Organisms like <InlineCode>HeaderPageOrganism</InlineCode> and <InlineCode>FooterPageOrganism</InlineCode> accept
          a <InlineCode>className</InlineCode> prop plus named slots (<InlineCode>title</InlineCode>, <InlineCode>nav</InlineCode>, <InlineCode>actions</InlineCode>).
        </p>
        <Code>{`// Dark header
<HeaderPageOrganism
  className="bg-gray-900 border-gray-700"
  title={<span className="text-white">My App</span>}
  nav={
    <nav className="text-gray-300">
      <a href="/" className="hover:text-white">Home</a>
    </nav>
  }
  actions={<ButtonAtom variant="outline" className="text-white border-white">Sign in</ButtonAtom>}
/>

// Compact footer
<FooterPageOrganism
  className="py-1 text-xs"
  text="© 2026 My Company"
/>`}</Code>
      </SubSection>

      <SubSection title="Page — prop-driven customization">
        <p className="text-sm mb-2">
          Pages like <InlineCode>UiHomeLogin</InlineCode> expose high-level props. For deeper customization,
          compose the page from its organisms directly.
        </p>
        <Code>{`// High-level props
<UiHomeLogin
  appTitle="My App"
  footerText="© 2026 My Company"
  onLogin={handleLogin}
/>

// Deep customization — compose from organisms
import {
  BorderLayout,
  HeaderPageOrganism,
  FooterPageOrganism,
  LoginOrganism,
} from 'jona-ui';

export function MyLoginPage() {
  return (
    <BorderLayout
      north={<HeaderPageOrganism title="My App" className="bg-indigo-700" />}
      south={<FooterPageOrganism text="© 2026" className="bg-gray-900 text-gray-400" />}
      center={
        <div className="flex items-center justify-center h-full bg-gray-50">
          <LoginOrganism {...loginProps} />
        </div>
      }
    />
  );
}`}</Code>
      </SubSection>
    </Section>

    {/* 5. If you use Tailwind in your project */}
    <Section title="5. If you already use Tailwind in your project">
      <p className="text-sm mb-4">
        If your project already has Tailwind, you can skip <InlineCode>jona-ui/index.css</InlineCode> and instead:
      </p>
      <ol className="list-decimal list-inside text-sm space-y-2 mb-4">
        <li>Import only the tokens: <InlineCode>import 'jona-ui/theme/tokens.css'</InlineCode></li>
        <li>Add the JONA color palette to your <InlineCode>tailwind.config.js</InlineCode></li>
        <li>Add <InlineCode>./node_modules/jona-ui/dist/**/*.js</InlineCode> to your <InlineCode>content</InlineCode> array</li>
      </ol>
      <Code>{`// tailwind.config.js
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/jona-ui/dist/**/*.js',  // scan jona-ui classes
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: 'rgb(var(--jona-primary-600) / <alpha-value>)',
          // ... add the shades you need
        },
        neutral: {
          200: 'rgb(var(--jona-neutral-200) / <alpha-value>)',
          // ...
        },
      },
    },
  },
};`}</Code>
    </Section>

  </div>
);
