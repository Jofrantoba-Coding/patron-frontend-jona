import {
  BadgeAtom,
  CardContent,
  CardHeader,
  CardMolecule,
  CardTitle,
  LinkAtom,
  PanelAtom,
  TextAtom,
} from 'jona-ui';
import type { InterLandingFeature } from './InterLandingFeature';

export function LandingFeatureView({ content }: InterLandingFeature) {
  return (
    <>
      <section id="inicio" className="hero-section">
        <PanelAtom className="hero-grid" variant="ghost" padding="none">
          <PanelAtom className="hero-copy" variant="ghost" padding="none">
            <BadgeAtom className="eyebrow">{content.hero.eyebrow}</BadgeAtom>
            <TextAtom as="h1" className="hero-title">
              {content.hero.title}
            </TextAtom>
            <TextAtom className="hero-summary">{content.hero.summary}</TextAtom>
            <PanelAtom className="hero-actions" variant="ghost" padding="none" layout="box" gap="sm" wrap>
              <LinkAtom href={content.hero.primaryAction.href} variant="button" className="hero-link-primary">
                {content.hero.primaryAction.label}
              </LinkAtom>
              <LinkAtom href={content.hero.secondaryAction.href} className="hero-link-secondary">
                {content.hero.secondaryAction.label}
              </LinkAtom>
            </PanelAtom>
          </PanelAtom>

          <PanelAtom className="dashboard-visual" variant="ghost" padding="none" aria-label="Dashboard de ejemplo">
            <div className="dashboard-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="dashboard-grid">
              <div className="kpi-card strong">Ventas<br /><b>+28%</b></div>
              <div className="kpi-card">Stock<br /><b>98%</b></div>
              <div className="chart-card">
                <i style={{ height: '48%' }} />
                <i style={{ height: '74%' }} />
                <i style={{ height: '58%' }} />
                <i style={{ height: '88%' }} />
                <i style={{ height: '66%' }} />
              </div>
              <div className="pipeline-card">
                <span />
                <span />
                <span />
              </div>
            </div>
          </PanelAtom>
        </PanelAtom>
      </section>

      <section className="metrics-band" aria-label="Indicadores Develtrex">
        {content.metrics.map((metric) => (
          <PanelAtom key={metric.label} className="metric-item" variant="ghost" padding="none">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </PanelAtom>
        ))}
      </section>

      <section className="section-shell about-section">
        <TextAtom as="h2" className="section-title">
          {content.purpose.title}
        </TextAtom>
        <PanelAtom className="two-column" variant="ghost" padding="none">
          {content.purpose.items.map((item) => (
            <CardMolecule key={item.title} className="quiet-card">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>{item.description}</CardContent>
            </CardMolecule>
          ))}
        </PanelAtom>
      </section>
    </>
  );
}
