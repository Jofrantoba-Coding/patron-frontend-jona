import { BoxLayout, LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import type { InterContactFeature } from './InterContactFeature';

export function ContactFeatureView({ content }: InterContactFeature) {
  return (
    <PanelAtom as="footer" id="contacto" className="contact-section" variant="ghost" padding="none" radius="none">
      <BoxLayout className="contact-shell" alignItems="center" justifyContent="between" gap="xl">
        <BoxLayout direction="column" alignItems="start" gap="sm">
          <TextAtom as="h2" className="contact-title">{content.title}</TextAtom>
          <TextAtom className="contact-subtitle">{content.subtitle}</TextAtom>
        </BoxLayout>
        <BoxLayout className="contact-actions" gap="sm" wrap>
          <LinkAtom href={content.phoneHref} className="contact-link">{content.phone}</LinkAtom>
          <LinkAtom href={content.emailHref} className="contact-link">{content.email}</LinkAtom>
          <LinkAtom href={content.whatsappHref} variant="button">Agendar por WhatsApp</LinkAtom>
        </BoxLayout>
      </BoxLayout>
      <PanelAtom className="contact-copyright" variant="ghost" padding="none">
        <TextAtom as="span">© {new Date().getFullYear()} Develtrex. Todos los derechos reservados.</TextAtom>
      </PanelAtom>
    </PanelAtom>
  );
}
