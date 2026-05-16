import { LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterContactPageFeature } from './InterContactPageFeature';

const CONTACT_METHODS = [
  {
    icon: '💬',
    label: 'WhatsApp',
    description: 'La forma más rápida. Respondemos en menos de 2 horas en horario laboral.',
    action: 'Abrir WhatsApp',
    hrefKey: 'whatsappHref' as const,
    primary: true,
  },
  {
    icon: '📞',
    label: 'Teléfono',
    description: 'Llámanos directamente para una conversación inmediata.',
    action: null,
    hrefKey: 'phoneHref' as const,
    primary: false,
  },
  {
    icon: '✉️',
    label: 'Email',
    description: 'Para consultas detalladas o documentación. Respondemos el mismo día.',
    action: null,
    hrefKey: 'emailHref' as const,
    primary: false,
  },
] as const;

const STEPS = [
  {
    num: '01',
    title: 'Cuéntanos tu situación',
    body: 'En 30 minutos nos describes tu contexto, los problemas que enfrentas y tus objetivos de negocio.',
  },
  {
    num: '02',
    title: 'Diagnóstico sin costo',
    body: 'Evaluamos tu arquitectura actual, identificamos las principales brechas y riesgos, y priorizamos junto a ti.',
  },
  {
    num: '03',
    title: 'Propuesta concreta',
    body: 'Recibes una propuesta con alcance, entregables, equipo y cronograma — sin compromisos previos.',
  },
];

export function ContactPageFeatureView({ content }: InterContactPageFeature) {
  const c = content.contact;

  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={c}
        products={content.products}
        services={content.services}
      />

      <PanelAtom as="main" variant="ghost" padding="none" radius="none">
        <PanelAtom as="section" className="contact-page-hero" variant="ghost" padding="none" radius="none">
          <PanelAtom className="section-shell section-heading align-center" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Contacto</TextAtom>
            <TextAtom as="h1" className="section-title">{c.title}</TextAtom>
            <TextAtom className="section-copy">{c.subtitle}</TextAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="contact-methods-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="section-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom className="contact-methods-grid" variant="ghost" padding="none" radius="none">
              {CONTACT_METHODS.map((method) => (
                <PanelAtom key={method.label} className={`contact-method-card${method.primary ? ' primary' : ''}`} variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="contact-method-icon" aria-hidden="true">{method.icon}</TextAtom>
                  <TextAtom as="strong" className="contact-method-label">{method.label}</TextAtom>
                  <TextAtom className="contact-method-desc">{method.description}</TextAtom>
                  {method.primary ? (
                    <LinkAtom href={c[method.hrefKey]} variant="button" className="contact-method-cta">
                      {method.action}
                    </LinkAtom>
                  ) : (
                    <LinkAtom href={c[method.hrefKey]} className="contact-method-link">
                      {method.hrefKey === 'phoneHref' ? c.phone : c.email}
                    </LinkAtom>
                  )}
                </PanelAtom>
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="section" className="contact-steps-section" variant="ghost" padding="none" radius="none">
          <PanelAtom className="section-shell" variant="ghost" padding="none" radius="none">
            <PanelAtom className="section-heading mb-10" variant="ghost" padding="none" radius="none">
              <TextAtom as="span" className="eyebrow">Qué esperar</TextAtom>
              <TextAtom as="h2" className="section-title">Así empieza la conversación</TextAtom>
            </PanelAtom>
            <PanelAtom className="contact-steps-list" variant="ghost" padding="none" radius="none">
              {STEPS.map((step) => (
                <PanelAtom key={step.num} className="contact-step" variant="ghost" padding="none" radius="none">
                  <TextAtom as="span" className="contact-step-num">{step.num}</TextAtom>
                  <PanelAtom className="contact-step-body" variant="ghost" padding="none" radius="none">
                    <TextAtom as="strong" className="contact-step-title">{step.title}</TextAtom>
                    <TextAtom className="contact-step-desc">{step.body}</TextAtom>
                  </PanelAtom>
                </PanelAtom>
              ))}
            </PanelAtom>
          </PanelAtom>
        </PanelAtom>

        <PanelAtom as="footer" className="contact-page-footer" variant="ghost" padding="none" radius="none">
          <TextAtom as="span">© {new Date().getFullYear()} Develtrex. Todos los derechos reservados.</TextAtom>
          <PanelAtom className="contact-page-footer-links" variant="ghost" padding="none" radius="none">
            <LinkAtom href={c.phoneHref} className="footer-link">{c.phone}</LinkAtom>
            <LinkAtom href={c.emailHref} className="footer-link">{c.email}</LinkAtom>
          </PanelAtom>
        </PanelAtom>
      </PanelAtom>
    </>
  );
}
