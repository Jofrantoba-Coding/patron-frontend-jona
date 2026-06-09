// JSiteFooterView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJSiteFooter } from './InterJSiteFooter';

export const JSiteFooterView: React.FC<InterJSiteFooter> = ({
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
    <JLabel as="span">{copyright}</JLabel>
    <JPanel variant="ghost" padding="none" radius="none" className="site-footer-links">
      {links.map((link) => (
        <JLabel variant="link" key={link.href} href={link.href} className="footer-link">
          {link.label}
        </JLabel>
      ))}
    </JPanel>
  </JPanel>
);
