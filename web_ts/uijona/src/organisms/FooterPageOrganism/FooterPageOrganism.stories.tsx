import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FooterPageOrganism } from './FooterPageOrganism';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof FooterPageOrganism> = {
  title: 'Organisms/FooterPageOrganism',
  component: FooterPageOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof FooterPageOrganism>;

export const Default: Story = {
  args: { text: '© 2026 JONA UI — Todos los derechos reservados' },
};

export const WithSlots: Story = {
  args: {
    left:   <span style={{ fontWeight: 'bold' }}>JONA UI</span>,
    center: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Contacto</a>
      </nav>
    ),
    right: <span>v1.2.5</span>,
  },
};

export const Interactive: Story = {
  render: () => {
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const texts = {
      es: { terms: 'Términos', privacy: 'Privacidad', contact: 'Contacto' },
      en: { terms: 'Terms', privacy: 'Privacy', contact: 'Contact' },
    };
    const t = texts[lang];
    return (
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <PanelAtom variant="ghost" padding="none" style={{ padding: '32px', textAlign: 'center', fontSize: '14px', color: '#a3a3a3' }}>
          Contenido de la aplicación
        </PanelAtom>
        <FooterPageOrganism
          left={<span style={{ fontWeight: 700 }}>JONA UI</span>}
          center={
            <nav style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <a href="#">{t.terms}</a>
              <a href="#">{t.privacy}</a>
              <a href="#">{t.contact}</a>
            </nav>
          }
          right={
            <ButtonAtom variant="outline" size="sm" onClick={() => setLang((l) => l === 'es' ? 'en' : 'es')}>
              {lang === 'es' ? 'EN' : 'ES'}
            </ButtonAtom>
          }
        />
      </PanelAtom>
    );
  },
};
