import { BadgeAtom, GridLayout, PanelAtom, TextAtom } from 'jona-ui';
import {
  BenefitItemMolecule,
  DetailCTAOrganism,
  DetailHeroOrganism,
  FaqItemMolecule,
} from 'jona-ui';
import { ContactFeature } from '../contact/ContactFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterProductDetailFeatureView } from './InterProductDetailFeature';

export function ProductDetailFeatureView({ content, product, detail, assetClass }: InterProductDetailFeatureView) {
  const visual = (
    <PanelAtom
      className={`detail-hero-asset light-asset ${assetClass}`}
      variant="ghost"
      padding="none"
      radius="none"
      aria-hidden="true"
    >
      <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
      <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
      <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
    </PanelAtom>
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
          backHref="/"
          backLabel="← Productos"
          eyebrow={<BadgeAtom variant="outline" className="detail-tag">{product.tag}</BadgeAtom>}
          title={product.name}
          outcome={product.outcome}
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
            <TextAtom as="span" className="eyebrow">Proceso</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Cómo trabajamos?</TextAtom>
            <PanelAtom className="detail-process-list" variant="ghost" padding="none" radius="none">
              {detail.process.map((item, index) => (
                <PanelAtom key={item.step} className="detail-process-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="detail-step-num">{String(index + 1).padStart(2, '0')}</TextAtom>
                  <PanelAtom className="detail-step-body" variant="ghost" padding="none" radius="none">
                    <TextAtom as="strong" className="detail-step-title">{item.step}</TextAtom>
                    <TextAtom className="detail-step-detail">{item.detail}</TextAtom>
                  </PanelAtom>
                </PanelAtom>
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="detail-section detail-deliverables" variant="ghost" padding="none" radius="none">
          <PanelAtom className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout columns="repeat(2, minmax(0, 1fr))" placement="fixed" className="detail-two-column">
              <PanelAtom className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Entregables</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿Qué recibes?</TextAtom>
                <PanelAtom as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {detail.deliverables.map((deliverable) => (
                    <PanelAtom key={deliverable} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <PanelAtom as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{deliverable}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </PanelAtom>

              <PanelAtom className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Características</TextAtom>
                <TextAtom as="h2" className="detail-h2">Highlights técnicos</TextAtom>
                <PanelAtom as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <PanelAtom key={highlight} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <PanelAtom as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{highlight}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </PanelAtom>
            </GridLayout>
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

        <DetailCTAOrganism
          title={`¿Quieres evaluar ${product.name} para tu empresa?`}
          body="En una sesión de 30 minutos evaluamos si aplica a tu operación, resolvemos tus dudas y definimos los siguientes pasos concretos."
          primaryHref={content.contact.whatsappHref}
          primaryLabel="Agendar sesión por WhatsApp"
          secondaryHref={content.contact.emailHref}
          secondaryLabel={content.contact.email}
        />

        <ContactFeature content={content.contact} />
      </PanelAtom>
    </>
  );
}
