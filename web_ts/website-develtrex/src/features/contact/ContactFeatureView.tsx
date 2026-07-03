import { JImagen, JLabel, JPanel } from 'jona-ui';
import { useUi } from '../../i18n';
import type { InterContactFeature } from './InterContactFeature';

export function ContactFeatureView({ content }: InterContactFeature) {
  const ui = useUi();
  const year = new Date().getFullYear();
  return (
    <JPanel as="footer" id="contacto" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
      {/* CTA */}
      <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-24">
        <JPanel variant="ghost" padding="none" radius="none" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 px-6 py-12 text-center sm:px-12 sm:py-16">
          <JPanel variant="ghost" padding="none" radius="none" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
          <JPanel variant="ghost" padding="none" radius="none" className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-400/20 blur-2xl" aria-hidden="true" />
          <JLabel as="h2" className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{content.title}</JLabel>
          <JLabel as="p" className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">{content.subtitle}</JLabel>
          <JPanel variant="ghost" padding="none" radius="none" className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <JLabel as="a" href={content.whatsappHref} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 sm:w-auto">
              {ui.cta.whatsapp}
            </JLabel>
            <JLabel as="a" href={content.phoneHref} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto">
              {content.phone}
            </JLabel>
          </JPanel>
        </JPanel>
      </JPanel>

      {/* Footer bar */}
      <JPanel variant="ghost" padding="none" radius="none" className="border-t border-neutral-200">
        <JPanel variant="ghost" padding="none" radius="none" className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-2">
            <JImagen src="/develtrex-logo.svg" alt="Develtrex" fit="contain" className="h-6 w-auto" />
            <JLabel as="span" className="text-sm font-bold text-neutral-900">DEVELTREX</JLabel>
          </JPanel>
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <JLabel as="a" href={content.phoneHref} className="text-neutral-500 no-underline transition-colors hover:text-neutral-900">{content.phone}</JLabel>
            <JLabel as="a" href={content.emailHref} className="text-neutral-500 no-underline transition-colors hover:text-neutral-900">{content.email}</JLabel>
          </JPanel>
          <JLabel as="span" className="text-xs text-neutral-400">© {year} Develtrex. {ui.footerRights}</JLabel>
        </JPanel>
      </JPanel>
    </JPanel>
  );
}
