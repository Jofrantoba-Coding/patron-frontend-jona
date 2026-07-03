import { JButton, JCard, JLabel, JPanel, JSectionHeading } from 'jona-ui';
import { useUi } from '../../i18n';
import { NavigationFeature } from '../navigation/NavigationFeature';
import { ContactFeature } from '../contact/ContactFeature';
import type { InterContactPageFeature } from './InterContactPageFeature';

export function ContactPageFeatureView({ content }: InterContactPageFeature) {
  const c = content.contact;
  const ui = useUi();

  const hrefs = [c.whatsappHref, c.phoneHref, c.emailHref];
  const fallbackActions = ['', c.phone, c.email];
  const methods = ui.contactPage.methods.map((m, i) => ({
    ...m,
    href: hrefs[i],
    action: m.action || fallbackActions[i],
  }));

  return (
    <>
      <NavigationFeature content={content.navigation} contact={c} products={content.products} services={content.services} />

      <JPanel as="main" variant="ghost" padding="none" radius="none">
        {/* Hero */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="relative overflow-hidden border-b border-neutral-200">
          <JPanel variant="ghost" padding="none" radius="none" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center" aria-hidden="true">
            <JPanel variant="ghost" padding="none" radius="none" className="h-[32rem] w-[32rem] rounded-full bg-gradient-to-b from-primary-100/70 to-transparent blur-3xl" />
          </JPanel>
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 text-center sm:py-24">
            <JLabel as="span" className="eyebrow">{ui.contactPage.eyebrow}</JLabel>
            <JLabel as="h1" className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">{c.title}</JLabel>
            <JLabel as="p" className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600">{c.subtitle}</JLabel>
          </JPanel>
        </JPanel>

        {/* Methods */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
          <JPanel variant="ghost" padding="none" radius="none" className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {methods.map((m) => (
              <JCard key={m.label} className={`flex flex-col gap-3 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${m.primary ? 'border-primary-200 bg-primary-50/50' : ''}`}>
                <JLabel as="span" className="text-3xl leading-none" aria-hidden="true">{m.icon}</JLabel>
                <JLabel as="h3" className="text-base font-bold text-neutral-900">{m.label}</JLabel>
                <JLabel as="p" className="text-sm leading-relaxed text-neutral-600">{m.description}</JLabel>
                <JButton href={m.href} variant="link" className="mt-2 w-fit">{m.action} →</JButton>
              </JCard>
            ))}
          </JPanel>
        </JPanel>

        {/* Steps */}
        <JPanel as="section" variant="ghost" padding="none" radius="none" className="border-t border-neutral-200 bg-neutral-50/60">
          <JPanel variant="ghost" padding="none" radius="none" className="container-page py-16 sm:py-20">
            <JSectionHeading eyebrow={ui.contactPage.stepsEyebrow} heading={ui.contactPage.stepsHeading} className="mb-10 max-w-2xl" />
            <JPanel variant="ghost" padding="none" radius="none" className="grid gap-5 md:grid-cols-3">
              {ui.contactPage.steps.map((s) => (
                <JCard key={s.num} className="flex flex-col gap-3 p-6">
                  <JLabel as="span" className="inline-grid h-10 w-10 place-items-center rounded-lg bg-primary-600 text-sm font-black text-white">{s.num}</JLabel>
                  <JLabel as="h3" className="text-base font-bold text-neutral-900">{s.title}</JLabel>
                  <JLabel as="p" className="text-sm leading-relaxed text-neutral-600">{s.body}</JLabel>
                </JCard>
              ))}
            </JPanel>
          </JPanel>
        </JPanel>

        <ContactFeature content={c} />
      </JPanel>
    </>
  );
}
