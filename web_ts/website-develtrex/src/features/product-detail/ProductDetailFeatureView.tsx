import { Link } from 'react-router-dom';
import { BadgeAtom, BoxLayout, GridLayout, LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import { ContactFeature } from '../contact/ContactFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterProductDetailFeatureView } from './InterProductDetailFeature';

export function ProductDetailFeatureView({ content, product, detail, assetClass }: InterProductDetailFeatureView) {
  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />

      <PanelAtom as="main" variant="ghost" padding="none" radius="none">
        <PanelAtom as="section" className="detail-hero" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-hero-inner" variant="ghost" padding="none" radius="none">
            <Link to="/" className="detail-back">← Productos</Link>
            <BoxLayout direction="column" alignItems="start" gap="md" className="detail-hero-copy">
              <BadgeAtom variant="outline" className="detail-tag">{product.tag}</BadgeAtom>
              <TextAtom as="h1" className="detail-title">{product.name}</TextAtom>
              <TextAtom className="detail-outcome">{product.outcome}</TextAtom>
              <BoxLayout gap="sm" wrap className="detail-hero-actions">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Solicitar información
                </LinkAtom>
                <LinkAtom href={content.contact.emailHref} className="detail-cta-secondary">
                  Escribirnos
                </LinkAtom>
              </BoxLayout>
            </BoxLayout>

            <PanelAtom className={`detail-hero-asset light-asset ${assetClass}`} variant="ghost" padding="none" radius="none" aria-hidden="true">
              <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
              <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
              <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
            </PanelAtom>
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
            <BadgeAtom className="eyebrow">Proceso</BadgeAtom>
            <TextAtom as="h2" className="detail-h2">¿Cómo trabajamos?</TextAtom>
            <BoxLayout direction="column" gap="sm" className="detail-process-list">
              {detail.process.map((item, index) => (
                <PanelAtom key={item.step} className="detail-process-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="detail-step-num">{String(index + 1).padStart(2, '0')}</TextAtom>
                  <BoxLayout direction="column" alignItems="start" gap="xs">
                    <TextAtom as="strong" className="detail-step-title">{item.step}</TextAtom>
                    <TextAtom className="detail-step-detail">{item.detail}</TextAtom>
                  </BoxLayout>
                </PanelAtom>
              ))}
            </BoxLayout>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-deliverables" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout autoFitMin="280px" gap="xl">
              <BoxLayout direction="column" alignItems="start" gap="md">
                <BadgeAtom className="eyebrow">Entregables</BadgeAtom>
                <TextAtom as="h2" className="detail-h2">¿Qué recibes?</TextAtom>
                <PanelAtom as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {detail.deliverables.map((deliverable) => (
                    <PanelAtom key={deliverable} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <PanelAtom as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{deliverable}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </BoxLayout>

              <BoxLayout direction="column" alignItems="start" gap="md">
                <BadgeAtom className="eyebrow">Características</BadgeAtom>
                <TextAtom as="h2" className="detail-h2">Highlights técnicos</TextAtom>
                <PanelAtom as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <PanelAtom key={highlight} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <PanelAtom as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{highlight}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </BoxLayout>
            </GridLayout>
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

        <PanelAtom as="section" className="detail-section detail-cta-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom className="detail-cta-box" variant="ghost" padding="none" radius="none">
              <TextAtom as="h2" className="detail-cta-title">¿Quieres evaluar {product.name} para tu empresa?</TextAtom>
              <TextAtom className="detail-cta-body">
                En una sesión de 30 minutos evaluamos si aplica a tu operación, resolvemos tus dudas y definimos los siguientes pasos concretos.
              </TextAtom>
              <BoxLayout gap="sm" wrap className="detail-cta-actions">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="detail-cta-primary">
                  Agendar sesión por WhatsApp
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
