import { LinkAtom, PanelAtom } from 'jona-ui';
import type { InterNavigationFeature } from './InterNavigationFeature';

export function NavigationFeatureView({ content, contact }: InterNavigationFeature) {
  return (
    <header className="site-header">
      <PanelAtom as="nav" className="nav-shell" layout="box" alignItems="center" justifyContent="between">
        <a className="brand-mark" href="#inicio" aria-label="Develtrex inicio">
          <img className="brand-symbol" src="./assets/develtrex-logo.svg" alt="" aria-hidden="true" />
          <span>{content.brand}</span>
        </a>

        <PanelAtom className="nav-links" variant="ghost" padding="none" layout="box" alignItems="center" gap="sm">
          {content.links.map((link) => (
            <LinkAtom key={link.href} href={link.href} variant="muted">
              {link.label}
            </LinkAtom>
          ))}
        </PanelAtom>

        <LinkAtom href={contact.whatsappHref} variant="button" className="nav-action">
          Cotizar
        </LinkAtom>
      </PanelAtom>
    </header>
  );
}
