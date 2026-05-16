import {
  LinkAtom,
  PanelAtom,
  TextAtom,
} from 'jona-ui';
import type { InterServicesFeature } from './InterServicesFeature';

const SERVICE_CATEGORIES = [
  'Desarrollo Digital',
  'Cloud & Arquitectura',
  'Plataforma & DevOps',
  'Datos & IA',
  'Seguridad & Operaciones',
] as const;

export function ServicesFeatureView({ content }: InterServicesFeature) {
  const servicesByCategory = SERVICE_CATEGORIES.map((cat) => ({
    category: cat,
    items: content.services.filter((s) => s.category === cat),
  }));

  return (
    <>
      <PanelAtom as="section" id="servicios" className="services-section" variant="ghost" padding="none" radius="none">
        <PanelAtom className="section-shell" variant="ghost" padding="none" radius="none">
          <PanelAtom className="section-heading mb-12" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Servicios</TextAtom>
            <TextAtom as="h2" className="section-title">{content.servicesIntro.title}</TextAtom>
            <TextAtom className="section-copy">{content.servicesIntro.description}</TextAtom>
          </PanelAtom>

          <PanelAtom className="services-by-category" variant="ghost" padding="none" radius="none">
            {servicesByCategory.map(({ category, items }) => (
              <PanelAtom key={category} className="services-cat-section" variant="ghost" padding="none" radius="none">
                <PanelAtom className="services-cat-header" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="services-cat-badge">{category}</TextAtom>
                </PanelAtom>
                <PanelAtom className="service-grid" variant="ghost" padding="none" radius="none">
                  {items.map((service) => (
                    <PanelAtom key={service.slug} className="service-card business-card" variant="ghost" padding="none" radius="none">
                      <PanelAtom className="card-area-header" variant="ghost" padding="none" radius="none">
                        <PanelAtom as="span" className={`service-icon icon-${service.visual}`} variant="ghost" padding="none" radius="none" aria-hidden="true" />
                        <TextAtom as="h3" className="card-title">{service.name}</TextAtom>
                        <TextAtom className="card-description">{service.promise}</TextAtom>
                      </PanelAtom>
                      <PanelAtom className="card-area-content" variant="ghost" padding="none" radius="none">
                        <TextAtom className="business-proof">{service.proof}</TextAtom>
                      </PanelAtom>
                      <PanelAtom className="card-area-footer" variant="ghost" padding="none" radius="none">
                        <LinkAtom href={`/servicios/${service.slug}`} className="card-detail-link">
                          Ver servicio →
                        </LinkAtom>
                      </PanelAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </PanelAtom>
            ))}
          </PanelAtom>
        </PanelAtom>
      </PanelAtom>

      <PanelAtom as="section" className="sales-cta-section" variant="ghost" padding="none" radius="none">
        <PanelAtom className="section-shell" variant="ghost" padding="none" radius="none">
          <PanelAtom className="sales-cta-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom variant="ghost" padding="none" radius="none">
              <TextAtom as="h2" className="sales-title">Ordena tu tecnología antes de que el caos frene tu crecimiento.</TextAtom>
              <TextAtom className="sales-copy">
                30 minutos son suficientes para identificar tus principales brechas, riesgos y la primera ruta de acción concreta.
              </TextAtom>
            </PanelAtom>
            <LinkAtom href={content.contact.whatsappHref} variant="button" className="sales-link">
              Diagnóstico gratuito
            </LinkAtom>
          </PanelAtom>
        </PanelAtom>
      </PanelAtom>
    </>
  );
}
