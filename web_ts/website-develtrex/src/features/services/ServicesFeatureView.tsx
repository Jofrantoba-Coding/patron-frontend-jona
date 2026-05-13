import {
  BadgeAtom,
  CardContent,
  CardDescription,
  CardHeader,
  CardMolecule,
  CardTitle,
  LinkAtom,
  PanelAtom,
  TextAtom,
} from 'jona-ui';
import type { InterServicesFeature } from './InterServicesFeature';

export function ServicesFeatureView({ content }: InterServicesFeature) {
  return (
    <>
      <section id="servicios" className="section-shell services-section">
        <div className="section-heading compact">
          <BadgeAtom className="eyebrow">Servicios</BadgeAtom>
          <TextAtom as="h2" className="section-title">
            {content.servicesIntro.title}
          </TextAtom>
          <TextAtom className="section-copy">{content.servicesIntro.description}</TextAtom>
        </div>

        <PanelAtom className="service-grid" variant="ghost" padding="none">
          {content.services.map((service) => (
            <CardMolecule key={service.name} className="service-card business-card">
              <CardHeader>
                <div className={`service-icon icon-${service.visual}`} aria-hidden="true" />
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.promise}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="business-proof">{service.proof}</p>
              </CardContent>
            </CardMolecule>
          ))}
        </PanelAtom>
      </section>

      <section id="proceso" className="section-shell process-section">
        <PanelAtom className="process-layout" variant="ghost" padding="none">
          <div>
            <BadgeAtom className="eyebrow">Proceso de venta consultiva</BadgeAtom>
            <TextAtom as="h2" className="section-title">
              De la idea al lanzamiento sin improvisar
            </TextAtom>
            <TextAtom className="section-copy">
              Un flujo pensado para vender servicios tecnologicos con alcance claro, entregables verificables y una base mantenible.
            </TextAtom>
            <PanelAtom className="offer-list" variant="ghost" padding="none">
              {content.offers.map((offer) => (
                <span key={offer}>{offer}</span>
              ))}
            </PanelAtom>
          </div>

          <PanelAtom className="timeline" variant="ghost" padding="none">
            {content.process.map((step, index) => (
              <CardMolecule key={step.title} className="timeline-card">
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </CardMolecule>
            ))}
          </PanelAtom>
        </PanelAtom>
      </section>

      <section className="sales-cta">
        <PanelAtom className="sales-cta-shell" variant="ghost" padding="none">
          <div>
            <TextAtom as="h2" className="sales-title">
              Lista tu proxima solucion digital para vender u operar mejor.
            </TextAtom>
            <TextAtom className="sales-copy">
              En una sesion inicial podemos priorizar el caso de negocio, definir alcance y estimar una primera entrega.
            </TextAtom>
          </div>
          <LinkAtom href={content.contact.whatsappHref} variant="button" className="sales-link">
            Solicitar diagnostico
          </LinkAtom>
        </PanelAtom>
      </section>
    </>
  );
}
