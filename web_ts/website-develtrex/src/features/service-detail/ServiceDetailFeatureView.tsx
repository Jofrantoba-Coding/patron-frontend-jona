import { Link } from 'react-router-dom';
import { GridLayout, LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import {
  BenefitItemMolecule,
  DetailCTAOrganism,
  DetailHeroOrganism,
  FaqItemMolecule,
  RelatedItemMolecule,
} from 'jona-ui';
import { ContactFeature } from '../contact/ContactFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterServiceDetailFeatureView } from './InterServiceDetailFeature';

export function ServiceDetailFeatureView({ content, service, detail }: InterServiceDetailFeatureView) {
  const relatedServices = content.services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  const visual = (
    <PanelAtom
      className={`detail-hero-asset service-visual-asset icon-${service.visual}`}
      variant="ghost"
      padding="none"
      radius="none"
      aria-hidden="true"
    />
  );

  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />

      <PanelAtom as="main" variant="ghost" padding="none" radius="none">
        <DetailHeroOrganism
          className="service-hero"
          backHref="/"
          backLabel="← Todos los servicios"
          eyebrow={service.category}
          title={service.name}
          outcome={service.promise}
          primaryHref={content.contact.whatsappHref}
          primaryLabel="Solicitar información"
          secondaryHref={content.contact.emailHref}
          secondaryLabel="Escribirnos"
          visual={visual}
        />

        <PanelAtom as="section" className="detail-section detail-overview" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout columns="repeat(2, minmax(0, 1fr))" placement="fixed" className="detail-two-column">
              <PanelAtom className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Descripción</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿De qué se trata?</TextAtom>
                <TextAtom className="detail-body">{detail.intro}</TextAtom>
              </PanelAtom>
              <PanelAtom className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Para quién</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿A quién le sirve?</TextAtom>
                <TextAtom className="detail-body">{detail.forWho}</TextAtom>
                <PanelAtom className="service-proof-box" variant="ghost" padding="none" radius="none">
                  <TextAtom className="service-proof-text">{service.proof}</TextAtom>
                </PanelAtom>
              </PanelAtom>
            </GridLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-benefits" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Beneficios</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Qué obtienes?</TextAtom>
            <GridLayout autoFitMin="280px" className="detail-benefits-grid">
              {detail.benefits.map((benefit) => (
                <BenefitItemMolecule key={benefit} text={benefit} />
              ))}
            </GridLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-process-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Metodología</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Cómo lo hacemos?</TextAtom>
            <PanelAtom className="detail-process-list" variant="ghost" padding="none" radius="none">
              {detail.approach.map((step, index) => (
                <PanelAtom key={step} className="detail-process-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="detail-step-num">{String(index + 1).padStart(2, '0')}</TextAtom>
                  <TextAtom className="detail-step-title">{step}</TextAtom>
                </PanelAtom>
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-faq" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">FAQ</TextAtom>
            <TextAtom as="h2" className="detail-h2">Preguntas frecuentes</TextAtom>
            <PanelAtom className="detail-faq-list" variant="ghost" padding="none" radius="none">
              {detail.faqs.map((faq) => (
                <FaqItemMolecule key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        {relatedServices.length > 0 && (
          <PanelAtom as="section" className="detail-section detail-related" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
              <TextAtom as="span" className="eyebrow">También en {service.category}</TextAtom>
              <TextAtom as="h2" className="detail-h2">Servicios relacionados que podrían interesarte</TextAtom>
              <GridLayout autoFitMin="280px" className="detail-related-grid">
                {relatedServices.map((s) => (
                  <RelatedItemMolecule
                    key={s.slug}
                    name={s.name}
                    outcome={s.promise}
                    href={`/servicios/${s.slug}`}
                    linkLabel="Ver servicio →"
                  />
                ))}
              </GridLayout>
            </PanelAtom>
          </PanelAtom>
        )}

        <DetailCTAOrganism
          title="¿Te interesa este servicio?"
          body="Conversemos sobre tu caso específico. Una sesión de 30 minutos es suficiente para saber si podemos ayudarte y cómo."
          primaryHref={content.contact.whatsappHref}
          primaryLabel="Agendar por WhatsApp"
          secondaryHref={content.contact.emailHref}
          secondaryLabel={content.contact.email}
        />

        <ContactFeature content={content.contact} />
      </PanelAtom>
    </>
  );
}
