import { LinkAtom, PanelAtom, TextAtom } from 'jona-ui';
import type { InterContactFeature } from './InterContactFeature';

export function ContactFeatureView({ content }: InterContactFeature) {
  return (
    <footer id="contacto" className="contact-section">
      <PanelAtom className="contact-shell" variant="ghost" padding="none">
        <div>
          <TextAtom as="h2" className="contact-title">
            {content.title}
          </TextAtom>
          <TextAtom className="contact-subtitle">{content.subtitle}</TextAtom>
        </div>
        <PanelAtom className="contact-actions" variant="ghost" padding="none" layout="box" gap="sm" wrap>
          <LinkAtom href={content.phoneHref} className="contact-link">
            {content.phone}
          </LinkAtom>
          <LinkAtom href={content.emailHref} className="contact-link">
            {content.email}
          </LinkAtom>
          <LinkAtom href={content.whatsappHref} variant="button">
            WhatsApp
          </LinkAtom>
        </PanelAtom>
      </PanelAtom>
    </footer>
  );
}
