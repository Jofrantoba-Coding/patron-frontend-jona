import {
  LinkAtom,
  MetricsBandOrganism,
  JPanel,
  TextAtom,
} from 'jona-ui';
import type { InterLandingFeature } from './InterLandingFeature';

function DashboardVisual() {
  return (
    <JPanel className="dashboard-visual" variant="ghost" padding="none" aria-label="Dashboard de ejemplo">
      <JPanel className="dashboard-toolbar" variant="ghost" padding="none" radius="none">
        <JPanel as="span" className="dot dot-red" variant="ghost" padding="none" radius="none" />
        <JPanel as="span" className="dot dot-yellow" variant="ghost" padding="none" radius="none" />
        <JPanel as="span" className="dot dot-green" variant="ghost" padding="none" radius="none" />
        <TextAtom as="span" className="dashboard-title-bar">Observability Platform</TextAtom>
        <JPanel as="span" className="status-pill" variant="ghost" padding="none" radius="none">
          <JPanel as="span" className="status-dot" variant="ghost" padding="none" radius="none" />
          <TextAtom as="span">All Systems Operational</TextAtom>
        </JPanel>
      </JPanel>
      <JPanel className="dashboard-grid" variant="ghost" padding="none" radius="none">
        <JPanel className="kpi-card strong" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">SLO APIs</TextAtom>
          <TextAtom as="strong" className="kpi-value">99.9%</TextAtom>
          <TextAtom as="span" className="kpi-trend up">↑ 0.2%</TextAtom>
        </JPanel>
        <JPanel className="kpi-card" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">K8S Pods</TextAtom>
          <TextAtom as="strong" className="kpi-value">98.7%</TextAtom>
          <TextAtom as="span" className="kpi-trend up">↑ estable</TextAtom>
        </JPanel>
        <JPanel className="kpi-card accent" variant="ghost" padding="none">
          <TextAtom as="span" className="kpi-label">MTTR</TextAtom>
          <TextAtom as="strong" className="kpi-value">4.2 m</TextAtom>
          <TextAtom as="span" className="kpi-trend down">↓ −38%</TextAtom>
        </JPanel>
        <JPanel className="chart-card" variant="ghost" padding="none">
          <TextAtom as="span" className="chart-label">API Latency (ms)</TextAtom>
          <JPanel className="chart-bars" variant="ghost" padding="none" radius="none">
            {[48, 74, 58, 88, 66, 52, 80].map((h, i) => (
              <JPanel key={i} as="span" variant="ghost" padding="none" radius="none" style={{ height: `${h}%` }} />
            ))}
          </JPanel>
        </JPanel>
        <JPanel className="alert-feed" variant="ghost" padding="none" radius="none">
          <TextAtom as="span" className="chart-label">Alertas recientes</TextAtom>
          <JPanel as="ul" className="alert-list" variant="ghost" padding="none" radius="none">
            {[
              { text: 'API Gateway — latencia normal', type: 'ok' },
              { text: 'K8S cluster — pods healthy', type: 'ok' },
              { text: 'DRP test — simulacro OK', type: 'warn' },
            ].map(({ text, type }) => (
              <JPanel key={text} as="li" className={`alert-item ${type}`} variant="ghost" padding="none" radius="none">
                <JPanel as="span" className="alert-dot" variant="ghost" padding="none" radius="none" />
                <TextAtom as="span">{text}</TextAtom>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>
      </JPanel>
    </JPanel>
  );
}

export function LandingFeatureView({ content }: InterLandingFeature) {
  return (
    <>
      <JPanel as="section" id="inicio" className="hero-section" variant="ghost" padding="none" radius="none">
        <JPanel className="hero-grid" variant="ghost" padding="none" radius="none">
          <JPanel className="hero-copy" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">{content.hero.eyebrow}</TextAtom>
            <TextAtom as="h1" className="hero-title">{content.hero.title}</TextAtom>
            <TextAtom className="hero-summary">{content.hero.summary}</TextAtom>
            <JPanel className="hero-actions" variant="ghost" padding="none" radius="none">
              <LinkAtom href={content.hero.primaryAction.href} variant="button" className="hero-link-primary">
                {content.hero.primaryAction.label}
              </LinkAtom>
              <LinkAtom href={content.hero.secondaryAction.href} className="hero-link-secondary">
                {content.hero.secondaryAction.label}
              </LinkAtom>
            </JPanel>
          </JPanel>
          <DashboardVisual />
        </JPanel>
      </JPanel>

      <MetricsBandOrganism metrics={content.metrics} aria-label="Indicadores Develtrex" />

      <JPanel as="section" className="about-section" variant="ghost" padding="none" radius="none">
        <JPanel className="section-shell" variant="ghost" padding="none" radius="none">
          <JPanel className="section-heading mb-10" variant="ghost" padding="none" radius="none">
            <TextAtom as="h2" className="section-title">{content.purpose.title}</TextAtom>
          </JPanel>
          <JPanel className="two-column" variant="ghost" padding="none" radius="none">
            {content.purpose.items.map((item) => (
              <JPanel key={item.title} className="quiet-card" variant="ghost" padding="none" radius="none">
                <JPanel className="card-area-header" variant="ghost" padding="none" radius="none">
                  <TextAtom as="h3" className="card-title">{item.title}</TextAtom>
                </JPanel>
                <JPanel className="card-area-content" variant="ghost" padding="none" radius="none">
                  <TextAtom className="card-description">{item.description}</TextAtom>
                </JPanel>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>
      </JPanel>
    </>
  );
}
