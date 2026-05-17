import {
  LinkAtom,
  JPanel,
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
      <JPanel as="section" id="servicios" className="services-section" variant="ghost" padding="none" radius="none">
        <JPanel className="section-shell" variant="ghost" padding="none" radius="none">
          <JPanel className="section-heading mb-12" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Servicios</TextAtom>
            <TextAtom as="h2" className="section-title">{content.servicesIntro.title}</TextAtom>
            <TextAtom className="section-copy">{content.servicesIntro.description}</TextAtom>
          </JPanel>

          <JPanel className="services-by-category" variant="ghost" padding="none" radius="none">
            {servicesByCategory.map(({ category, items }) => (
              <JPanel key={category} className="services-cat-section" variant="ghost" padding="none" radius="none">
                <JPanel className="services-cat-header" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="services-cat-badge">{category}</TextAtom>
                </JPanel>
                <JPanel className="service-grid" variant="ghost" padding="none" radius="none">
                  {items.map((service) => (
                    <JPanel key={service.slug} className="service-card business-card" variant="ghost" padding="none" radius="none">
                      <JPanel className="card-area-header" variant="ghost" padding="none" radius="none">
                        <JPanel as="span" className={`service-icon icon-${service.visual}`} variant="ghost" padding="none" radius="none" aria-hidden="true" />
                        <TextAtom as="h3" className="card-title">{service.name}</TextAtom>
                        <TextAtom className="card-description">{service.promise}</TextAtom>
                      </JPanel>
                      <JPanel className="card-area-content" variant="ghost" padding="none" radius="none">
                        <TextAtom className="business-proof">{service.proof}</TextAtom>
                      </JPanel>
                      <JPanel className="card-area-footer" variant="ghost" padding="none" radius="none">
                        <LinkAtom href={`/servicios/${service.slug}`} className="card-detail-link">
                          Ver servicio →
                        </LinkAtom>
                      </JPanel>
                    </JPanel>
                  ))}
                </JPanel>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>
      </JPanel>

      <JPanel as="section" className="sales-cta-section" variant="ghost" padding="none" radius="none">
        <JPanel className="section-shell" variant="ghost" padding="none" radius="none">
          <JPanel className="sales-cta-shell" variant="ghost" padding="none" radius="none">
            <JPanel variant="ghost" padding="none" radius="none">
              <TextAtom as="h2" className="sales-title">Ordena tu tecnología antes de que el caos frene tu crecimiento.</TextAtom>
              <TextAtom className="sales-copy">
                30 minutos son suficientes para identificar tus principales brechas, riesgos y la primera ruta de acción concreta.
              </TextAtom>
            </JPanel>
            <LinkAtom href={content.contact.whatsappHref} variant="button" className="sales-link">
              Diagnóstico gratuito
            </LinkAtom>
          </JPanel>
        </JPanel>
      </JPanel>
    </>
  );
}
