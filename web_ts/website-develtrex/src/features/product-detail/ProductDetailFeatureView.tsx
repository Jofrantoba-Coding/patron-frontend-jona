import { Link } from 'react-router-dom';
import { JAccordion, JBadge, JButton, JGlyph, JLabel, JPanel, JSectionHeading } from 'jona-ui';
import { NavigationFeature } from '../navigation/NavigationFeature';
import { ContactFeature } from '../contact/ContactFeature';
import { useUi } from '../../i18n';
import type { InterProductDetailFeatureView } from './InterProductDetailFeature';

const Check = () => (
  <JGlyph size="md" tone="primary" strokeWidth={2.5} className="mt-0.5"><path d="M20 6 9 17l-5-5" /></JGlyph>
);

export function ProductDetailFeatureView({ content, product, detail }: InterProductDetailFeatureView) {
  const ui = useUi();
  const faqItems = detail.faqs.map((f) => ({ value: f.q, title: f.q, content: f.a }));

  return (
    <>
      <NavigationFeature content={content.navigation} contact={content.contact} products={content.products} services={content.services} />

      <JPanel as="main" variant="ghost" padding="none" radius="none">
        {/* Hero */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="relative overflow-hidden border-b border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-14 sm:py-20">
            <JLabel asChild className="text-sm font-semibold text-neutral-500 no-underline transition-colors hover:text-neutral-900"><Link to="/#productos">{ui.detail.backProducts}</Link></JLabel>
            <JPanel variant="ghost" padding="none" radius="none" className="mt-6 max-w-3xl">
              <JBadge variant="outline">{product.tag}</JBadge>
              <JLabel as="h1" className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">{product.name}</JLabel>
              <JLabel as="p" className="mt-4 text-lg leading-relaxed text-neutral-600">{product.outcome}</JLabel>
              <JPanel variant="ghost" padding="none" radius="none" className="mt-8 flex flex-col gap-3 sm:flex-row">
                <JButton href={content.contact.whatsappHref} fullWidth className="sm:w-auto">{ui.detail.primaryCta}</JButton>
                <JButton href={content.contact.emailHref} variant="outline" fullWidth className="sm:w-auto">{ui.detail.secondaryCta}</JButton>
              </JPanel>
            </JPanel>
          </JPanel>
        </JPanel>

        {/* Overview */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page grid gap-10 py-16 sm:py-20 md:grid-cols-2">
          <JSectionHeading eyebrow={ui.detail.descripcion} heading={ui.detail.deQueSeTrata} description={detail.intro} />
          <JSectionHeading eyebrow={ui.detail.paraQuien} heading={ui.detail.aQuienLeSirve} description={detail.forWho} />
        </JPanel>

        {/* Benefits */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="border-y border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
            <JSectionHeading eyebrow={ui.detail.beneficios} heading={ui.detail.queObtienes} className="mb-8" />
            <JPanel variant="ghost" padding="none" radius="none" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              {detail.benefits.map((b) => (
                <JPanel key={b} variant="ghost" padding="none" radius="none" className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-700"><Check /><JLabel as="span">{b}</JLabel></JPanel>
              ))}
            </JPanel>
          </JPanel>
        </JPanel>

        {/* Process */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
          <JSectionHeading eyebrow={ui.detail.proceso} heading={ui.detail.comoTrabajamos} className="mb-8" />
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-4">
            {detail.process.map((item, i) => (
              <JPanel key={item.step} variant="ghost" padding="none" radius="none" className="flex items-start gap-5 rounded-2xl border border-neutral-200 bg-white p-6">
                <JLabel as="span" className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-50 text-sm font-black text-primary-700">{String(i + 1).padStart(2, '0')}</JLabel>
                <JPanel variant="ghost" padding="none" radius="none">
                  <JLabel as="h3" className="text-base font-bold text-neutral-900">{item.step}</JLabel>
                  <JLabel as="p" className="mt-1 text-sm leading-relaxed text-neutral-600">{item.detail}</JLabel>
                </JPanel>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>

        {/* Deliverables + Highlights */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page grid gap-12 py-16 sm:py-20 md:grid-cols-2">
            <JPanel variant="ghost" padding="none" radius="none">
              <JSectionHeading eyebrow={ui.detail.entregables} heading={ui.detail.queRecibes} className="mb-6" />
              <JPanel as="ul" variant="ghost" padding="none" radius="none" className="space-y-3">
                {detail.deliverables.map((d) => (
                  <JPanel as="li" key={d} variant="ghost" padding="none" radius="none" className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700"><Check /><JLabel as="span">{d}</JLabel></JPanel>
                ))}
              </JPanel>
            </JPanel>
            <JPanel variant="ghost" padding="none" radius="none">
              <JSectionHeading eyebrow={ui.detail.caracteristicas} heading={ui.detail.highlights} className="mb-6" />
              <JPanel as="ul" variant="ghost" padding="none" radius="none" className="space-y-3">
                {product.highlights.map((h) => (
                  <JPanel as="li" key={h} variant="ghost" padding="none" radius="none" className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700"><Check /><JLabel as="span">{h}</JLabel></JPanel>
                ))}
              </JPanel>
            </JPanel>
          </JPanel>
        </JPanel>

        {/* FAQ */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
          <JSectionHeading eyebrow={ui.detail.faq} heading={ui.detail.preguntasFrecuentes} className="mb-8" />
          <JAccordion items={faqItems} variant="bordered" />
        </JPanel>

        <ContactFeature content={content.contact} />
      </JPanel>
    </>
  );
}
