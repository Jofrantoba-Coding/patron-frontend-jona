import { Link } from 'react-router-dom';
import { BadgeAtom, BoxLayout, GridLayout, LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
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
            <BoxLayout direction="column" alignItems="start" gap="md" className="detail-hero-copy">
              <BadgeAtom className="eyebrow service-eyebrow">{service.category}</BadgeAtom>
              <TextAtom as="h1" className="detail-title">{service.name}</TextAtom>
              <TextAtom className="detail-outcome">{service.promise}</TextAtom>
              <BoxLayout gap="sm" wrap className="detail-hero-actions">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Solicitar información
                </LinkAtom>
                <LinkAtom href={content.contact.emailHref} className="detail-cta-secondary">
                  Escribirnos
                </LinkAtom>
              </BoxLayout>
            </BoxLayout>

            <PanelAtom className={`detail-hero-asset service-visual-asset icon-${service.visual}`} variant="ghost" padding="none" radius="none" aria-hidden="true" />
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-overview" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout autoFitMin="280px" gap="xl">
              <BoxLayout direction="column" alignItems="start" gap="md">
                <BadgeAtom className="eyebrow">Descripción</BadgeAtom>
                <TextAtom as="h2" className="detail-h2">¿De qué se trata?</TextAtom>
                <TextAtom className="detail-body">{detail.intro}</TextAtom>
              </BoxLayout>
              <BoxLayout direction="column" alignItems="start" gap="md">
                <BadgeAtom className="eyebrow">Para quién</BadgeAtom>
                <TextAtom as="h2" className="detail-h2">¿A quién le sirve?</TextAtom>
                <TextAtom className="detail-body">{detail.forWho}</TextAtom>
                <PanelAtom className="service-proof-box" variant="ghost" padding="none" radius="none">
                  <TextAtom className="service-proof-text">{service.proof}</TextAtom>
                </PanelAtom>
              </BoxLayout>
            </GridLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-benefits" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <BadgeAtom className="eyebrow">Beneficios</BadgeAtom>
            <TextAtom as="h2" className="detail-h2">¿Qué obtienes?</TextAtom>
            <GridLayout autoFitMin="260px" gap="md" className="detail-benefits-grid">
              {detail.benefits.map((benefit) => (
                <PanelAtom key={benefit} className="detail-benefit-card" variant="ghost" padding="none" radius="none">
                  <PanelAtom as="span" className="detail-benefit-dot" variant="ghost" padding="none" radius="none" />
                  <TextAtom className="detail-benefit-text">{benefit}</TextAtom>
                </PanelAtom>
              ))}
            </GridLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-process-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <BadgeAtom className="eyebrow">Metodología</BadgeAtom>
            <TextAtom as="h2" className="detail-h2">¿Cómo lo hacemos?</TextAtom>
            <BoxLayout direction="column" gap="sm" className="detail-process-list">
              {detail.approach.map((step, index) => (
                <PanelAtom key={step} className="detail-process-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="detail-step-num">{String(index + 1).padStart(2, '0')}</TextAtom>
                  <TextAtom className="detail-step-title">{step}</TextAtom>
                </PanelAtom>
              ))}
            </BoxLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-faq" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <BadgeAtom className="eyebrow">FAQ</BadgeAtom>
            <TextAtom as="h2" className="detail-h2">Preguntas frecuentes</TextAtom>
            <BoxLayout direction="column" gap="md" className="detail-faq-list">
              {detail.faqs.map((faq) => (
                <PanelAtom key={faq.q} className="detail-faq-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="strong" className="detail-faq-q">{faq.q}</TextAtom>
                  <TextAtom className="detail-faq-a">{faq.a}</TextAtom>
                </PanelAtom>
              ))}
            </BoxLayout>
          </PanelAtom>
        </PanelAtom>

        {relatedServices.length > 0 && (
          <PanelAtom as="section" className="detail-section detail-related" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
              <BadgeAtom className="eyebrow">También en {service.category}</BadgeAtom>
              <TextAtom as="h2" className="detail-h2">Servicios relacionados que podrían interesarte</TextAtom>
              <GridLayout autoFitMin="280px" gap="md">
                {relatedServices.map((s) => (
                  <Link key={s.slug} to={`/servicios/${s.slug}`} className="detail-related-card">
                    <TextAtom as="strong" className="detail-related-name">{s.name}</TextAtom>
                    <TextAtom className="detail-related-outcome">{s.promise}</TextAtom>
                    <TextAtom as="span" className="detail-related-link">Ver servicio →</TextAtom>
                  </Link>
                ))}
              </GridLayout>
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
              <BoxLayout gap="sm" wrap className="detail-cta-actions">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Agendar por WhatsApp
                </LinkAtom>
                <LinkAtom href={content.contact.emailHref} className="detail-cta-secondary">
                  {content.contact.email}
                </LinkAtom>
              </BoxLayout>
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <ContactFeature content={content.contact} />
      </PanelAtom>
    </>
  );
}
