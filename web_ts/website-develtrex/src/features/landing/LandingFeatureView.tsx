import {
  CardContent,
  CardDescription,
  CardHeader,
  CardMolecule,
  CardTitle,
  GridLayout,
  MarketingHeroMolecule,
  MetricCardMolecule,
  PanelAtom,
  SectionHeadingMolecule,
  SectionShellAtom,
  TextAtom,
} from 'jona-ui';
import type { InterLandingFeature } from './InterLandingFeature';

function DashboardVisual() {
  return (
    <PanelAtom className="dashboard-visual" variant="ghost" padding="none" aria-label="Dashboard de ejemplo">
      <PanelAtom className="dashboard-toolbar" variant="ghost" padding="none" radius="none">
        <PanelAtom as="span" className="dot dot-red" variant="ghost" padding="none" radius="none" />
        <PanelAtom as="span" className="dot dot-yellow" variant="ghost" padding="none" radius="none" />
        <PanelAtom as="span" className="dot dot-green" variant="ghost" padding="none" radius="none" />
        <TextAtom as="span" className="dashboard-title-bar">Observability Platform</TextAtom>
        <PanelAtom as="span" className="status-pill" variant="ghost" padding="none" radius="none">
          <PanelAtom as="span" className="status-dot" variant="ghost" padding="none" radius="none" />
          All Systems Operational
        </PanelAtom>
      </PanelAtom>
      <PanelAtom className="dashboard-grid" variant="ghost" padding="none" radius="none">
        <PanelAtom className="kpi-card strong" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">SLO APIs</TextAtom>
          <TextAtom as="strong" className="kpi-value">99.9%</TextAtom>
          <TextAtom as="span" className="kpi-trend up">↑ 0.2%</TextAtom>
        </PanelAtom>
        <PanelAtom className="kpi-card" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">K8S Pods</TextAtom>
          <TextAtom as="strong" className="kpi-value">98.7%</TextAtom>
          <TextAtom as="span" className="kpi-trend up">↑ estable</TextAtom>
        </PanelAtom>
        <PanelAtom className="kpi-card accent" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">MTTR</TextAtom>
          <TextAtom as="strong" className="kpi-value">4.2 m</TextAtom>
          <TextAtom as="span" className="kpi-trend down">↓ −38%</TextAtom>
        </PanelAtom>
        <PanelAtom className="chart-card" variant="ghost" padding="none">
          <TextAtom as="span" className="chart-label">API Latency (ms)</TextAtom>
          <PanelAtom className="chart-bars" variant="ghost" padding="none" radius="none">
            {[48, 74, 58, 88, 66, 52, 80].map((h, i) => (
              <PanelAtom key={i} as="span" variant="ghost" padding="none" radius="none" style={{ height: `${h}%` }} />
            ))}
          </PanelAtom>
        </PanelAtom>
        <PanelAtom className="alert-feed" variant="ghost" padding="none" radius="none">
          <TextAtom as="span" className="chart-label">Alertas recientes</TextAtom>
          <PanelAtom as="ul" className="alert-list" variant="ghost" padding="none" radius="none">
            {[
              { text: 'API Gateway — latencia normal', type: 'ok' },
              { text: 'K8S cluster — pods healthy', type: 'ok' },
              { text: 'DRP test — simulacro OK', type: 'warn' },
            ].map(({ text, type }) => (
              <PanelAtom key={text} as="li" className={`alert-item ${type}`} variant="ghost" padding="none" radius="none">
                <PanelAtom as="span" className="alert-dot" variant="ghost" padding="none" radius="none" />
                {text}
              </PanelAtom>
            ))}
          </PanelAtom>
        </PanelAtom>
      </PanelAtom>
    </PanelAtom>
  );
}

export function LandingFeatureView({ content }: InterLandingFeature) {
  return (
    <>
      {/* ── Hero ── */}
      <MarketingHeroMolecule
        id="inicio"
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.summary}
        ctas={[
          { label: content.hero.primaryAction.label, href: content.hero.primaryAction.href, variant: 'primary' },
          { label: content.hero.secondaryAction.label, href: content.hero.secondaryAction.href, variant: 'outline' },
        ]}
        visual={<DashboardVisual />}
      />

      {/* ── Metrics band ── */}
      <section className="metrics-section" aria-label="Indicadores Develtrex">
        <SectionShellAtom>
          <div className="metrics-grid">
            {content.metrics.map((metric) => (
              <MetricCardMolecule key={metric.label} value={metric.value} label={metric.label} tone="dark" />
            ))}
          </div>
        </SectionShellAtom>
      </section>

      {/* ── About / Purpose ── */}
      <section className="about-section">
        <SectionShellAtom>
          <SectionHeadingMolecule heading={content.purpose.title} className="mb-10" />
          <GridLayout autoFitMin="360px" gap="lg">
            {content.purpose.items.map((item) => (
              <CardMolecule key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </CardMolecule>
            ))}
          </GridLayout>
        </SectionShellAtom>
      </section>
    </>
  );
}
