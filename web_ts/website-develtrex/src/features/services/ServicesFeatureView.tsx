import {
  GridLayout,
  SalesCTAMolecule,
  SectionHeadingMolecule,
  SectionShellAtom,
  ServiceCardMolecule,
} from 'jona-ui';
import type { InterServicesFeature } from './InterServicesFeature';

const SERVICE_CATEGORIES = [
  'Desarrollo Digital',
  'Cloud & Arquitectura',
  'Plataforma & DevOps',
  'Datos & IA',
  'Seguridad & Operaciones',
] as const;

const VISUAL_EMOJI: Record<string, string> = {
  build:    '🏗️',
  modern:   '📱',
  cloud:    '☁️',
  data:     '📊',
  database: '🗄️',
  commerce: '🛍️',
};

export function ServicesFeatureView({ content }: InterServicesFeature) {
  const servicesByCategory = SERVICE_CATEGORIES.map((cat) => ({
    category: cat,
    items: content.services.filter((s) => s.category === cat),
  }));

  return (
    <>
      {/* ── Services by category ── */}
      <section id="servicios" className="services-section">
        <SectionShellAtom>
          <SectionHeadingMolecule
            eyebrow="Servicios"
            heading={content.servicesIntro.title}
            description={content.servicesIntro.description}
            className="mb-12"
          />

          <div className="services-by-category">
            {servicesByCategory.map(({ category, items }) => (
              <div key={category} className="services-cat-section">
                <div className="services-cat-header">
                  <span className="services-cat-badge">{category}</span>
                </div>
                <GridLayout autoFitMin="300px" gap="md">
                  {items.map((service) => (
                    <ServiceCardMolecule
                      key={service.slug}
                      icon={VISUAL_EMOJI[service.visual] ?? '⚡'}
                      title={service.name}
                      description={service.promise}
                      tags={[service.proof]}
                      href={`/servicios/${service.slug}`}
                    />
                  ))}
                </GridLayout>
              </div>
            ))}
          </div>
        </SectionShellAtom>
      </section>

      {/* ── Sales CTA ── */}
      <section className="sales-cta-section">
        <SectionShellAtom>
          <SalesCTAMolecule
            heading="Ordena tu tecnología antes de que el caos frene tu crecimiento."
            description="30 minutos son suficientes para identificar tus principales brechas, riesgos y la primera ruta de acción concreta."
            primaryLabel="Diagnóstico gratuito"
            primaryHref={content.contact.whatsappHref}
            tone="brand"
          />
        </SectionShellAtom>
      </section>
    </>
  );
}
