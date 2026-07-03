import { Link } from 'react-router-dom';
import { JAccordion, JButton, JGlyph, JLabel, JPanel, JSectionHeading, JServiceCard } from 'jona-ui';
import { NavigationFeature } from '../navigation/NavigationFeature';
import { ContactFeature } from '../contact/ContactFeature';
import { useUi } from '../../i18n';
import type { InterServiceDetailFeatureView } from './InterServiceDetailFeature';

const Check = () => (
  <JGlyph size="md" tone="primary" strokeWidth={2.5} className="mt-0.5"><path d="M20 6 9 17l-5-5" /></JGlyph>
);

export function ServiceDetailFeatureView({ content, service, detail }: InterServiceDetailFeatureView) {
  const ui = useUi();
  const categoryLabel = ui.categoryLabels[service.category] ?? service.category;
  const related = content.services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);
  const faqItems = detail.faqs.map((f) => ({ value: f.q, title: f.q, content: f.a }));

  return (
    <>
      <NavigationFeature content={content.navigation} contact={content.contact} products={content.products} services={content.services} />

      <JPanel as="main" variant="ghost" padding="none" radius="none">
        {/* Hero */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="relative overflow-hidden border-b border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-14 sm:py-20">
            <JLabel asChild className="text-sm font-semibold text-neutral-500 no-underline transition-colors hover:text-neutral-900"><Link to="/#servicios">{ui.detail.backServices}</Link></JLabel>
            <JPanel variant="ghost" padding="none" radius="none" className="mt-6 max-w-3xl">
              <JLabel as="span" className="eyebrow">{categoryLabel}</JLabel>
              <JLabel as="h1" className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">{service.name}</JLabel>
              <JLabel as="p" className="mt-4 text-lg leading-relaxed text-neutral-600">{service.promise}</JLabel>
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
          <JPanel variant="ghost" padding="none" radius="none">
            <JSectionHeading eyebrow={ui.detail.paraQuien} heading={ui.detail.aQuienLeSirve} description={detail.forWho} />
            <JPanel variant="ghost" padding="none" radius="none" className="mt-5 rounded-xl border-l-4 border-primary-500 bg-primary-50/60 p-4 text-sm italic leading-relaxed text-neutral-700">
              {service.proof}
            </JPanel>
          </JPanel>
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

        {/* Approach */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
          <JSectionHeading eyebrow={ui.detail.metodologia} heading={ui.detail.comoLoHacemos} className="mb-8" />
          <JPanel variant="ghost" padding="none" radius="none" className="grid gap-4 sm:grid-cols-2">
            {detail.approach.map((step, i) => (
              <JPanel key={step} variant="ghost" padding="none" radius="none" className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
                <JLabel as="span" className="inline-grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-sm font-black text-primary-700">{String(i + 1).padStart(2, '0')}</JLabel>
                <JLabel as="p" className="text-sm font-medium leading-relaxed text-neutral-700">{step}</JLabel>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>

        {/* FAQ */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
            <JSectionHeading eyebrow={ui.detail.faq} heading={ui.detail.preguntasFrecuentes} className="mb-8" />
            <JAccordion items={faqItems} variant="bordered" />
          </JPanel>
        </JPanel>

        {/* Related */}
        {related.length > 0 && (
          <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
            <JSectionHeading eyebrow={`${ui.detail.relacionadosEyebrow} ${categoryLabel}`} heading={ui.detail.relacionadosHeading} className="mb-8" />
            <JPanel variant="ghost" padding="none" radius="none" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
              {related.map((s) => (
                <JServiceCard key={s.slug} title={s.name} description={s.promise} href={`/servicios/${s.slug}`} />
              ))}
            </JPanel>
          </JPanel>
        )}

        <ContactFeature content={content.contact} />
      </JPanel>
    </>
  );
}
