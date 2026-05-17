import { BadgeAtom, GridLayout, JPanel, TextAtom } from 'jona-ui';
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
    <JPanel
      className={`detail-hero-asset light-asset ${assetClass}`}
      variant="ghost"
      padding="none"
      radius="none"
      aria-hidden="true"
    >
      <JPanel as="span" variant="ghost" padding="none" radius="none" />
      <JPanel as="span" variant="ghost" padding="none" radius="none" />
      <JPanel as="span" variant="ghost" padding="none" radius="none" />
    </JPanel>
  );

  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />

      <JPanel as="main" variant="ghost" padding="none" radius="none">
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

        <JPanel as="section" className="detail-section detail-overview" variant="ghost" padding="none" radius="none">
          <JPanel className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout columns="repeat(2, minmax(0, 1fr))" placement="fixed" className="detail-two-column">
              <JPanel className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Descripción</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿De qué se trata?</TextAtom>
                <TextAtom className="detail-body">{detail.intro}</TextAtom>
              </JPanel>
              <JPanel className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Para quién</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿A quién le sirve?</TextAtom>
                <TextAtom className="detail-body">{detail.forWho}</TextAtom>
              </JPanel>
            </GridLayout>
          </JPanel>
        </JPanel>

        <JPanel as="section" className="detail-section detail-benefits" variant="ghost" padding="none" radius="none">
          <JPanel className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Beneficios</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Qué obtienes?</TextAtom>
            <GridLayout autoFitMin="280px" className="detail-benefits-grid">
              {detail.benefits.map((benefit) => (
                <BenefitItemMolecule key={benefit} text={benefit} />
              ))}
            </GridLayout>
          </JPanel>
        </JPanel>

        <JPanel as="section" className="detail-section detail-process-section" variant="ghost" padding="none" radius="none">
          <JPanel className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Proceso</TextAtom>
            <TextAtom as="h2" className="detail-h2">¿Cómo trabajamos?</TextAtom>
            <JPanel className="detail-process-list" variant="ghost" padding="none" radius="none">
              {detail.process.map((item, index) => (
                <JPanel key={item.step} className="detail-process-item" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="detail-step-num">{String(index + 1).padStart(2, '0')}</TextAtom>
                  <JPanel className="detail-step-body" variant="ghost" padding="none" radius="none">
                    <TextAtom as="strong" className="detail-step-title">{item.step}</TextAtom>
                    <TextAtom className="detail-step-detail">{item.detail}</TextAtom>
                  </JPanel>
                </JPanel>
              ))}
            </JPanel>
          </JPanel>
        </JPanel>

        <JPanel as="section" className="detail-section detail-deliverables" variant="ghost" padding="none" radius="none">
          <JPanel className="detail-shell" variant="ghost" padding="none" radius="none">
            <GridLayout columns="repeat(2, minmax(0, 1fr))" placement="fixed" className="detail-two-column">
              <JPanel className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Entregables</TextAtom>
                <TextAtom as="h2" className="detail-h2">¿Qué recibes?</TextAtom>
                <JPanel as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {detail.deliverables.map((deliverable) => (
                    <JPanel key={deliverable} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <JPanel as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{deliverable}</TextAtom>
                    </JPanel>
                  ))}
                </JPanel>
              </JPanel>

              <JPanel className="detail-copy-block" variant="ghost" padding="none" radius="none">
                <TextAtom as="span" className="eyebrow">Características</TextAtom>
                <TextAtom as="h2" className="detail-h2">Highlights técnicos</TextAtom>
                <JPanel as="ul" className="detail-deliverable-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <JPanel key={highlight} as="li" className="detail-deliverable-item" variant="ghost" padding="none" radius="none">
                      <JPanel as="span" className="detail-check" variant="ghost" padding="none" radius="none" />
                      <TextAtom>{highlight}</TextAtom>
                    </JPanel>
                  ))}
                </JPanel>
              </JPanel>
            </GridLayout>
          </JPanel>
        </JPanel>

        <JPanel as="section" className="detail-section detail-faq" variant="ghost" padding="none" radius="none">
          <JPanel className="detail-shell" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">FAQ</TextAtom>
            <TextAtom as="h2" className="detail-h2">Preguntas frecuentes</TextAtom>
            <JPanel className="detail-faq-list" variant="ghost" padding="none" radius="none">
              {detail.faqs.map((faq) => (
                <FaqItemMolecule key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </JPanel>
          </JPanel>
        </JPanel>

        <DetailCTAOrganism
          title={`¿Quieres evaluar ${product.name} para tu empresa?`}
          body="En una sesión de 30 minutos evaluamos si aplica a tu operación, resolvemos tus dudas y definimos los siguientes pasos concretos."
          primaryHref={content.contact.whatsappHref}
          primaryLabel="Agendar sesión por WhatsApp"
          secondaryHref={content.contact.emailHref}
          secondaryLabel={content.contact.email}
        />

        <ContactFeature content={content.contact} />
      </JPanel>
    </>
  );
}
