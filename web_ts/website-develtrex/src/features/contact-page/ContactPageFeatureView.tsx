import { BoxLayout, LinkAtom, SectionHeadingMolecule, SectionShellAtom } from 'jona-ui';
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

      <main>
        {/* ── Hero ── */}
        <section className="contact-page-hero">
          <SectionShellAtom>
            <SectionHeadingMolecule
              eyebrow="Contacto"
              heading={c.title}
              description={c.subtitle}
              tone="dark"
              eyebrowVariant="white"
              align="center"
            />
          </SectionShellAtom>
        </section>

        {/* ── Contact methods ── */}
        <section className="contact-methods-section">
          <SectionShellAtom>
            <div className="contact-methods-grid">
              {CONTACT_METHODS.map((method) => (
                <div key={method.label} className={`contact-method-card${method.primary ? ' primary' : ''}`}>
                  <span className="contact-method-icon" aria-hidden="true">{method.icon}</span>
                  <strong className="contact-method-label">{method.label}</strong>
                  <p className="contact-method-desc">{method.description}</p>
                  {method.primary ? (
                    <LinkAtom href={c[method.hrefKey]} variant="button" className="contact-method-cta">
                      {method.action}
                    </LinkAtom>
                  ) : (
                    <LinkAtom href={c[method.hrefKey]} className="contact-method-link">
                      {method.hrefKey === 'phoneHref' ? c.phone : c.email}
                    </LinkAtom>
                  )}
                </div>
              ))}
            </div>
          </SectionShellAtom>
        </section>

        {/* ── What to expect ── */}
        <section className="contact-steps-section">
          <SectionShellAtom>
            <SectionHeadingMolecule
              eyebrow="Qué esperar"
              heading="Así empieza la conversación"
              className="mb-10"
            />
            <div className="contact-steps-list">
              {STEPS.map((step) => (
                <div key={step.num} className="contact-step">
                  <span className="contact-step-num">{step.num}</span>
                  <div className="contact-step-body">
                    <strong className="contact-step-title">{step.title}</strong>
                    <p className="contact-step-desc">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionShellAtom>
        </section>

        {/* ── Footer strip ── */}
        <footer className="contact-page-footer">
          <span>© {new Date().getFullYear()} Develtrex. Todos los derechos reservados.</span>
          <BoxLayout gap="sm">
            <LinkAtom href={c.phoneHref} className="footer-link">{c.phone}</LinkAtom>
            <LinkAtom href={c.emailHref} className="footer-link">{c.email}</LinkAtom>
          </BoxLayout>
        </footer>
      </main>
    </>
  );
}
