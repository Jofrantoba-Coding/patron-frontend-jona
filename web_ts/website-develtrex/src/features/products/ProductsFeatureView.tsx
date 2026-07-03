import { JBadge, JButton, JCard, JGlyph, JLabel, JPanel, JSectionHeading } from 'jona-ui';
import { useUi } from '../../i18n';
import type { InterProductsFeature } from './InterProductsFeature';

export function ProductsFeatureView({ content }: InterProductsFeature) {
  const ui = useUi();
  return (
    <JPanel as="section" id="productos" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-24">
      <JSectionHeading
        eyebrow={ui.products.eyebrow}
        heading={ui.products.heading}
        description={ui.products.description}
        className="mb-12 max-w-2xl"
      />

      <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-8">
        {content.products.map((product) => (
          <JPanel key={product.name} variant="ghost" padding="none" radius="none" className="grid overflow-hidden rounded-3xl border border-neutral-200 bg-white lg:grid-cols-2">
            {/* Copy */}
            <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-5 p-8 sm:p-10">
              <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-2">
                <JBadge variant="outline">{product.tag}</JBadge>
              </JPanel>
              <JLabel as="h3" className="text-2xl font-extrabold tracking-tight text-neutral-900">{product.name}</JLabel>
              <JLabel as="p" className="text-sm leading-relaxed text-neutral-600">{product.description}</JLabel>
              <JLabel as="p" className="text-base font-semibold text-neutral-900">{product.outcome}</JLabel>
              <JPanel as="ul" variant="ghost" padding="none" radius="none" className="grid gap-2.5 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <JPanel as="li" key={h} variant="ghost" padding="none" radius="none" className="flex items-start gap-2 text-sm text-neutral-600">
                    <JGlyph size="sm" tone="primary" strokeWidth={2.5} className="mt-0.5"><path d="M20 6 9 17l-5-5" /></JGlyph>
                    <JLabel as="span">{h}</JLabel>
                  </JPanel>
                ))}
              </JPanel>
              <JPanel variant="ghost" padding="none" radius="none" className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <JButton href={content.contact.whatsappHref} fullWidth className="sm:w-auto">{ui.detail.requestDemo}</JButton>
                <JButton href={`/productos/${product.slug}`} variant="outline" fullWidth className="sm:w-auto">{ui.detail.viewDetails}</JButton>
              </JPanel>
            </JPanel>
            {/* Visual */}
            <JPanel variant="ghost" padding="none" radius="none" className="relative hidden items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/40 p-10 lg:flex">
              <JCard className="w-full max-w-sm p-5 shadow-xl">
                <JPanel variant="ghost" padding="none" radius="none" className="mb-4 flex items-center justify-between">
                  <JLabel as="span" className="text-sm font-bold text-neutral-900">{ui.products.panelTitle}</JLabel>
                  <JBadge variant="outline">{ui.products.panelBadge}</JBadge>
                </JPanel>
                <JPanel variant="ghost" padding="none" radius="none" className="space-y-2.5">
                  {ui.products.rows.map((r) => (
                    <JPanel key={r.label} variant="ghost" padding="none" radius="none" className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/60 px-3 py-2">
                      <JLabel as="span" className="text-xs text-neutral-600">{r.label}</JLabel>
                      <JLabel as="span" className="text-xs font-semibold text-neutral-900">{r.value}</JLabel>
                    </JPanel>
                  ))}
                </JPanel>
              </JCard>
            </JPanel>
          </JPanel>
        ))}
      </JPanel>
    </JPanel>
  );
}
