import { Link } from 'react-router-dom';
import { LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import { ContactFeature } from '../contact/ContactFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterServiceDetailFeatureView } from './InterServiceDetailFeature';

export function ServiceDetailFeatureView({ content, service, detail }: InterServiceDetailFeatureView) {
  const relatedServices = content.services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />

      <PanelAtom as="main" variant="ghost" padding="none" radius="none">
        <PanelAtom as="section" className="detail-hero service-hero" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-hero-inner" variant="ghost" padding="none" radius="none">
            <Link to="/" className="detail-back">← Todos los servicios</Link>
            <PanelAtom className="detail-hero-copy" variant="ghost" padding="none" radius="none">
              <TextAtom as="span" className="eyebrow service-eyebrow">{service.category}</TextAtom>
              <TextAtom as="h1" className="detail-title">{service.name}</TextAtom>
              <TextAtom className="detail-outcome">{service.promise}</TextAtom>
              <PanelAtom className="detail-hero-actions" variant="ghost" padding="none" radius="none">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Solicitar información
                </LinkAtom>
                <LinkAtom href={content.contact.emailHref} className="detail-cta-secondary">
                  Escribirnos
                </LinkAtom>
              </PanelAtom>
            </PanelAtom>

            <PanelAtom className={`detail-hero-asset service-visual-asset icon-${service.visual}`} variant="ghost" padding="none" radius="none" aria-hidden="true" />
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-overview" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-two-column" variant="ghost" padding="none" radius="none">
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
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-benefits" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Beneficios</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Qué obtienes?</TextAtom>
            <PanelAtom className="detail-benefits-grid" variant="ghost" padding="none" radius="none">
              {detail.benefits.map((benefit) => (
                <PanelAtom key={benefit} className="detail-benefit-card" variant="ghost" padding="none" radius="none">
                  <PanelAtom as="span" className="detail-benefit-dot" variant="ghost" padding="none" radius="none" />
                  <TextAtom className="detail-benefit-text">{benefit}</TextAtom>
                </PanelAtom>
              ))}
            </PanelAtom>
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
                <PanelAtom key={faq.q} className="detail-faq-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="strong" className="detail-faq-q">{faq.q}</TextAtom>
                  <TextAtom className="detail-faq-a">{faq.a}</TextAtom>
                </PanelAtom>
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        {relatedServices.length > 0 && (
          <PanelAtom as="section" className="detail-section detail-related" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
              <TextAtom as="span" className="eyebrow">También en {service.category}</TextAtom>
              <TextAtom as="h2" className="detail-h2">Servicios relacionados que podrían interesarte</TextAtom>
              <PanelAtom className="detail-related-grid" variant="ghost" padding="none" radius="none">
                {relatedServices.map((s) => (
                  <Link key={s.slug} to={`/servicios/${s.slug}`} className="detail-related-card">
                    <TextAtom as="strong" className="detail-related-name">{s.name}</TextAtom>
                    <TextAtom className="detail-related-outcome">{s.promise}</TextAtom>
                    <TextAtom as="span" className="detail-related-link">Ver servicio →</TextAtom>
                  </Link>
                ))}
              </PanelAtom>
            </PanelAtom>
          </PanelAtom>
        )}

        <PanelAtom as="section" className="detail-section detail-cta-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-cta-box" variant="ghost" padding="none" radius="none">
              <TextAtom as="h2" className="detail-cta-title">¿Te interesa este servicio?</TextAtom>
              <TextAtom className="detail-cta-body">
                Conversemos sobre tu caso específico. Una sesión de 30 minutos es suficiente para saber si podemos ayudarte y cómo.
              </TextAtom>
              <PanelAtom className="detail-cta-actions" variant="ghost" padding="none" radius="none">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Agendar por WhatsApp
                </LinkAtom>
                <LinkAtom href={content.contact.emailHref} className="detail-cta-secondary">
                  {content.contact.email}
                </LinkAtom>
              </PanelAtom>
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <ContactFeature content={content.contact} />
      </PanelAtom>
    </>
  );
}
