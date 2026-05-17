import { JPanel, TextAtom } from 'jona-ui';
import {
  ContactMethodsOrganism,
  ContactStepsOrganism,
  SiteFooterOrganism,
} from 'jona-ui';
import { NavigationFeature } from '../navigation/NavigationFeature';
import type { InterContactPageFeature } from './InterContactPageFeature';

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

  const CONTACT_METHODS = [
    {
      icon: '💬',
      label: 'WhatsApp',
      description: 'La forma más rápida. Respondemos en menos de 2 horas en horario laboral.',
      href: c.whatsappHref,
      actionLabel: 'Abrir WhatsApp',
      isPrimary: true,
    },
    {
      icon: '📞',
      label: 'Teléfono',
      description: 'Llámanos directamente para una conversación inmediata.',
      href: c.phoneHref,
      isPrimary: false,
    },
    {
      icon: '✉️',
      label: 'Email',
      description: 'Para consultas detalladas o documentación. Respondemos el mismo día.',
      href: c.emailHref,
      isPrimary: false,
    },
  ];

  const FOOTER_LINKS = [
    { label: c.phone, href: c.phoneHref },
    { label: c.email, href: c.emailHref },
  ];

  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={c}
        products={content.products}
        services={content.services}
      />

      <JPanel as="main" variant="ghost" padding="none" radius="none">
        <JPanel as="section" className="contact-page-hero" variant="ghost" padding="none" radius="none">
          <JPanel className="section-shell section-heading align-center" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="eyebrow">Contacto</TextAtom>
            <TextAtom as="h1" className="section-title">{c.title}</TextAtom>
            <TextAtom className="section-copy">{c.subtitle}</TextAtom>
          </JPanel>
        </JPanel>

        <ContactMethodsOrganism methods={CONTACT_METHODS} />

        <ContactStepsOrganism
          eyebrow="Qué esperar"
          heading="Así empieza la conversación"
          steps={STEPS}
        />

        <SiteFooterOrganism
          copyright={`© ${new Date().getFullYear()} Develtrex. Todos los derechos reservados.`}
          links={FOOTER_LINKS}
        />
      </JPanel>
    </>
  );
}
