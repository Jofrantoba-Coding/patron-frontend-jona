// SiteFooterOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterSiteFooterOrganism } from './InterSiteFooterOrganism';

export const SiteFooterOrganismView: React.FC<InterSiteFooterOrganism> = ({
  copyright,
  links,
  className,
}) => (
  <JPanel
    as="footer"
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('site-footer', className)}
  >
    <TextAtom as="span">{copyright}</TextAtom>
    <JPanel variant="ghost" padding="none" radius="none" className="site-footer-links">
      {links.map((link) => (
        <LinkAtom key={link.href} href={link.href} className="footer-link">
          {link.label}
        </LinkAtom>
      ))}
    </JPanel>
  </JPanel>
);
