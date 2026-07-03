import { JGlyph, JLabel, JPanel, JSectionHeading, JSeparator, JServiceCard } from 'jona-ui';
import { useUi } from '../../i18n';
import type { InterServicesFeature } from './InterServicesFeature';

const CATEGORY_ORDER = [
  'Arquitectura & Cloud', 'Desarrollo', 'APIs & Integración', 'Plataforma & DevSecOps', 'Datos & IA', 'Soluciones de negocio', 'Talento',
] as const;

const CATEGORY_ICON: Record<string, JSX.Element> = {
  'Arquitectura & Cloud': <path d="M17.5 19a4.5 4.5 0 0 0 0-9h-1.8A7 7 0 1 0 4 15.7" />,
  'Desarrollo': <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  'APIs & Integración': <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.71 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  'Plataforma & DevSecOps': <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />,
  'Datos & IA': <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /></>,
  'Soluciones de negocio': <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM10 5h4v2h-4V5Z" />,
  'Talento': <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
};

export function ServicesFeatureView({ content }: InterServicesFeature) {
  const ui = useUi();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: content.services.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <JPanel as="section" id="servicios" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
      <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-24">
        <JSectionHeading
          eyebrow={ui.servicesEyebrow}
          heading={content.servicesIntro.title}
          description={content.servicesIntro.description}
          className="mx-auto mb-12 max-w-2xl items-center text-center"
        />

        <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-12">
          {grouped.map(({ category, items }) => (
            <JPanel key={category} variant="ghost" padding="none" radius="none">
              <JPanel variant="ghost" padding="none" radius="none" className="mb-5 flex items-center gap-3">
                <JPanel as="span" variant="ghost" padding="none" radius="none" className="grid h-9 w-9 place-items-center rounded-lg bg-white text-primary-600 shadow-sm ring-1 ring-neutral-200">
                  <JGlyph size="md">
                    {CATEGORY_ICON[category]}
                  </JGlyph>
                </JPanel>
                <JLabel as="h3" className="text-lg font-bold text-neutral-900">{ui.categoryLabels[category] ?? category}</JLabel>
                <JSeparator className="w-auto flex-1" />
              </JPanel>
              <JPanel variant="ghost" padding="none" radius="none" className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">
                {items.map((s) => (
                  <JServiceCard key={s.slug} title={s.name} description={s.promise} proof={s.proof} href={`/servicios/${s.slug}`} />
                ))}
              </JPanel>
            </JPanel>
          ))}
        </JPanel>

        {/* Process */}
        <JPanel variant="ghost" padding="none" radius="none" className="mt-20">
          <JSectionHeading eyebrow={ui.process.eyebrow} heading={ui.process.heading} className="mb-8 max-w-2xl" />
          <JPanel variant="ghost" padding="none" radius="none" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, i) => (
              <JPanel key={step.title} variant="ghost" padding="none" radius="none" className="flex items-start gap-3.5">
                <JPanel as="span" variant="ghost" padding="none" radius="none" className="inline-grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-600 text-sm font-black text-white">{i + 1}</JPanel>
                <JPanel variant="ghost" padding="none" radius="none" className="min-w-0">
                  <JLabel as="h4" className="text-sm font-bold text-neutral-900">{step.title}</JLabel>
                  <JLabel as="p" className="mt-1.5 text-sm leading-relaxed text-neutral-600">{step.description}</JLabel>
                </JPanel>
              </JPanel>
            ))}
          </JPanel>
        </JPanel>
      </JPanel>
    </JPanel>
  );
}
