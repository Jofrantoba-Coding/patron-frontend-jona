import { LinkAtom, JPanel, TextAtom } from 'jona-ui';
import type { InterContactFeature } from './InterContactFeature';

export function ContactFeatureView({ content }: InterContactFeature) {
  return (
    <JPanel as="footer" id="contacto" className="contact-section" variant="ghost" padding="none" radius="none">
      <JPanel className="contact-shell" variant="ghost" padding="none" radius="none">
        <JPanel className="contact-copy" variant="ghost" padding="none" radius="none">
          <TextAtom as="h2" className="contact-title">{content.title}</TextAtom>
          <TextAtom className="contact-subtitle">{content.subtitle}</TextAtom>
        </JPanel>
        <JPanel className="contact-actions" variant="ghost" padding="none" radius="none">
          <LinkAtom href={content.phoneHref} className="contact-link">{content.phone}</LinkAtom>
          <LinkAtom href={content.emailHref} className="contact-link">{content.email}</LinkAtom>
          <LinkAtom href={content.whatsappHref} variant="button">Agendar por WhatsApp</LinkAtom>
        </JPanel>
      </JPanel>
      <JPanel className="contact-copyright" variant="ghost" padding="none">
        <TextAtom as="span">© {new Date().getFullYear()} Develtrex. Todos los derechos reservados.</TextAtom>
      </JPanel>
    </JPanel>
  );
}
