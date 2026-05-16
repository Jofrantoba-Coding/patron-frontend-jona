import { LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import type { InterContactFeature } from './InterContactFeature';

export function ContactFeatureView({ content }: InterContactFeature) {
  return (
    <PanelAtom as="footer" id="contacto" className="contact-section" variant="ghost" padding="none" radius="none">
      <PanelAtom className="contact-shell" variant="ghost" padding="none" radius="none">
        <PanelAtom className="contact-copy" variant="ghost" padding="none" radius="none">
          <TextAtom as="h2" className="contact-title">{content.title}</TextAtom>
          <TextAtom className="contact-subtitle">{content.subtitle}</TextAtom>
        </PanelAtom>
        <PanelAtom className="contact-actions" variant="ghost" padding="none" radius="none">
          <LinkAtom href={content.phoneHref} className="contact-link">{content.phone}</LinkAtom>
          <LinkAtom href={content.emailHref} className="contact-link">{content.email}</LinkAtom>
          <LinkAtom href={content.whatsappHref} variant="button">Agendar por WhatsApp</LinkAtom>
        </PanelAtom>
      </PanelAtom>
      <PanelAtom className="contact-copyright" variant="ghost" padding="none">
        <TextAtom as="span">© {new Date().getFullYear()} Develtrex. Todos los derechos reservados.</TextAtom>
      </PanelAtom>
    </PanelAtom>
  );
}
