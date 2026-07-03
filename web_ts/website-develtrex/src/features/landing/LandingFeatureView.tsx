import { useEffect, useState, type ReactNode } from 'react';
import { JButton, JCard, JDashboardPreview, JDot, JGlyph, JLabel, JLogoMarquee, JPanel, JSectionHeading, JStatCard } from 'jona-ui';
import { useUi } from '../../i18n';
import type { InterLandingFeature } from './InterLandingFeature';

const TECH_STACK = [
  // Cloud-native
  'AWS', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform',
  // Backend enterprise
  'Java', 'Spring Boot', 'Spring Cloud', 'WebFlux', 'Node.js',
  // Frontend
  'React', 'Angular', 'Vue.js', 'TypeScript',
  // Data
  'PostgreSQL', 'Oracle', 'SQL Server', 'DynamoDB', 'Firestore', 'Redis', 'BigQuery',
  // Mensajería
  'Apache Kafka', 'Debezium',
  // API Management
  'Kong', 'MuleSoft', 'Apigee', 'IBM webMethods',
  // Seguridad e integración
  'Keycloak', 'OAuth2', 'mTLS', 'Cloudflare', 'ISO 20022',
];

// Iconos de industria (independientes del idioma), en el mismo orden que ui.industries.items
const INDUSTRY_ICONS: ReactNode[] = [
  <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
  <path d="M3 21h18M5 10h14M5 6l7-3 7 3M6 10v11M18 10v11M10 14v3M14 14v3" />,
  <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="15.5" cy="15.5" r="1.2" /></>,
  <path d="M3 21h18M6 21V8l6-4 6 4v13M10 21v-6h4v6" />,
  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />,
  <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />,
];

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || words.length <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <JPanel as="span" variant="ghost" padding="none" radius="none" aria-live="polite" className="inline-flex">
      <JLabel as="span" key={i} className="jhero-word bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
        {words[i % words.length]}
      </JLabel>
    </JPanel>
  );
}

const DASHBOARD_STATS = [
  { label: 'SLO APIs', value: '99.9%', delta: '↑ 0.2%', accent: true },
  { label: 'K8S Pods', value: '98.7%', delta: '↑ estable' },
  { label: 'MTTR', value: '4.2 m', delta: '↓ −38%' },
  { label: 'Incidencias', value: '0', delta: 'últimas 24h' },
];

export function LandingFeatureView({ content }: InterLandingFeature) {
  const ui = useUi();
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <JPanel as="section" id="inicio" variant="ghost" padding="none" radius="none" className="relative overflow-hidden">
        <JPanel variant="ghost" padding="none" radius="none" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center" aria-hidden="true">
          <JPanel variant="ghost" padding="none" radius="none" className="h-[36rem] w-[40rem] rounded-full bg-gradient-to-br from-primary-200/60 via-accent-100/40 to-transparent blur-3xl" />
        </JPanel>
        <JPanel variant="ghost" padding="none" radius="none" className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <JPanel variant="ghost" padding="none" radius="none" className="flex max-w-xl flex-col gap-6 animate-fade-up">
            <JPanel variant="ghost" padding="none" radius="none" className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
              <JDot size="sm" tone="primary" />
              <JLabel as="span" className="text-xs font-medium text-neutral-600">{content.hero.eyebrow}</JLabel>
            </JPanel>
            <JLabel as="h1" className="text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.4rem]">
              {content.hero.title}
            </JLabel>
            <JLabel as="p" className="text-lg font-medium text-neutral-500">
              {ui.hero.buildingPrefix} <RotatingWord words={ui.hero.rotating} />.
            </JLabel>
            <JLabel as="p" className="max-w-prose text-base leading-relaxed text-neutral-600">
              {content.hero.summary}
            </JLabel>
            <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <JButton href={content.hero.primaryAction.href} size="lg" fullWidth className="sm:w-auto">
                {content.hero.primaryAction.label}
              </JButton>
              <JButton href={content.hero.secondaryAction.href} variant="outline" size="lg" fullWidth className="sm:w-auto">
                {content.hero.secondaryAction.label} →
              </JButton>
            </JPanel>
          </JPanel>
          <JPanel variant="ghost" padding="none" radius="none" className="animate-fade-up [animation-delay:120ms]">
            <JDashboardPreview
              title="Observability Platform"
              statusLabel="Operational"
              stats={DASHBOARD_STATS}
              chartLabel="API Latency (ms)"
            />
          </JPanel>
        </JPanel>
      </JPanel>

      {/* ── Tech stack marquee ───────────────────────────────── */}
      <JPanel variant="ghost" padding="none" radius="none" className="border-t border-neutral-200">
        <JPanel variant="ghost" padding="none" radius="none" className="container-page">
          <JLogoMarquee
            label={ui.stackLabel}
            speed="slow"
            items={TECH_STACK.map((t) => (
              <JLabel key={t} as="span" className="whitespace-nowrap text-xl font-bold tracking-tight">{t}</JLabel>
            ))}
          />
        </JPanel>
      </JPanel>

      {/* ── Metrics ──────────────────────────────────────────── */}
      <JPanel as="section" aria-label="Indicadores" variant="ghost" padding="none" radius="none" className="border-y border-neutral-200 bg-neutral-50/60">
        <JPanel variant="ghost" padding="none" radius="none" className="container-page grid gap-4 py-10 sm:grid-cols-3">
          {content.metrics.map((m) => (
            <JStatCard key={m.label} label={m.label} value={m.value} valueFirst className="border-neutral-200/70" />
          ))}
        </JPanel>
      </JPanel>

      {/* ── Purpose ──────────────────────────────────────────── */}
      <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-24">
        <JSectionHeading eyebrow="Por qué Develtrex" heading={content.purpose.title} className="mb-10 max-w-2xl" />
        <JPanel variant="ghost" padding="none" radius="none" className="grid gap-6 md:grid-cols-2">
          {content.purpose.items.map((item) => (
            <JCard key={item.title} className="flex items-start gap-4 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)]">
              <JPanel variant="ghost" padding="none" radius="none" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
                <JGlyph size="lg"><path d="M20 6 9 17l-5-5" /></JGlyph>
              </JPanel>
              <JPanel variant="ghost" padding="none" radius="none" className="min-w-0">
                <JLabel as="h3" className="text-lg font-bold text-neutral-900">{item.title}</JLabel>
                <JLabel as="p" className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</JLabel>
              </JPanel>
            </JCard>
          ))}
        </JPanel>
      </JPanel>

      {/* ── Industries ───────────────────────────────────────── */}
      <JPanel as="section" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
        <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-24">
          <JSectionHeading eyebrow={ui.industries.eyebrow} heading={ui.industries.heading} description={ui.industries.description} className="mb-10 max-w-2xl" />
          <JPanel variant="ghost" padding="none" radius="none" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ui.industries.items.map((ind, i) => (
              <JCard key={ind.name} className="flex items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)]">
                <JPanel variant="ghost" padding="none" radius="none" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                  <JGlyph size="md">{INDUSTRY_ICONS[i]}</JGlyph>
                </JPanel>
                <JPanel variant="ghost" padding="none" radius="none" className="min-w-0">
                  <JLabel as="h3" className="text-base font-bold text-neutral-900">{ind.name}</JLabel>
                  <JLabel as="p" className="mt-1 text-sm leading-relaxed text-neutral-600">{ind.desc}</JLabel>
                </JPanel>
              </JCard>
            ))}
          </JPanel>
        </JPanel>
      </JPanel>
    </>
  );
}
