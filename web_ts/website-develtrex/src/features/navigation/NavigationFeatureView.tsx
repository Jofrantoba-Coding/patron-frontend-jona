import { type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { JBadge, JButton, JGlyph, JImagen, JLabel, JLanguageSwitcher, JNavbar, JPanel } from 'jona-ui';
import { useUi, useLocale, LOCALES } from '../../i18n';
import type { InterNavigationFeature } from './InterNavigationFeature';

type DropdownMenu = 'products' | 'services';

export interface InterNavigationFeatureView extends InterNavigationFeature {
  navRef: RefObject<HTMLElement>;
  isMenuOpen: boolean;
  activeDropdown: DropdownMenu | null;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onDropdownEnter: (menu: DropdownMenu) => void;
  onDropdownToggle: (menu: DropdownMenu) => void;
  onCloseDropdown: () => void;
}

const Chevron = ({ open }: { open: boolean }) => (
  <JGlyph viewBox="0 0 14 14" size="xs" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
    <polyline points="2 5 7 10 12 5" />
  </JGlyph>
);

const SERVICE_CATEGORIES = [
  'Arquitectura & Cloud', 'Desarrollo', 'APIs & Integración', 'Plataforma & DevSecOps', 'Datos & IA', 'Soluciones de negocio', 'Talento',
] as const;

const navLinkClass = 'rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 no-underline transition-colors hover:bg-neutral-100 hover:text-neutral-900';

export function NavigationFeatureView({
  content, contact, products, services,
  navRef, isMenuOpen, activeDropdown,
  onToggleMenu, onCloseMenu, onDropdownEnter, onDropdownToggle, onCloseDropdown,
}: InterNavigationFeatureView) {
  const ui = useUi();
  const { locale, setLocale } = useLocale();
  const servicesByCategory = SERVICE_CATEGORIES.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }));
  const homeLink = content.links.find((l) => l.href === '/');
  const secondaryLinks = content.links.filter((l) => l.href !== '/');

  const brand = (
    <JLabel asChild className="flex items-center gap-2.5 no-underline">
      <Link to="/" aria-label="Develtrex inicio">
        <JImagen src="/develtrex-logo.svg" alt="Develtrex" fit="contain" loading="eager" className="h-7 w-auto" />
        <JLabel as="span" className="text-lg font-extrabold tracking-tight text-neutral-900">{content.brand}</JLabel>
      </Link>
    </JLabel>
  );

  return (
    <JNavbar
      navRef={navRef}
      mobileOpen={isMenuOpen}
      onMobileToggle={onToggleMenu}
      onMobileClose={onCloseMenu}
      brand={brand}
      actions={
        <>
          <JLanguageSwitcher languages={LOCALES} value={locale} onChange={(c) => setLocale(c as typeof locale)} className="hidden sm:inline-flex" />
          <JButton href={contact.whatsappHref} className="hidden sm:inline-flex">{ui.nav.book}</JButton>
        </>
      }
      drawer={
        <>
          {homeLink && <JLabel asChild className="text-base font-semibold text-neutral-900 no-underline"><Link to={homeLink.href} onClick={onCloseMenu}>{homeLink.label}</Link></JLabel>}
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-2">
            <JLabel as="span" className="eyebrow">{ui.nav.products}</JLabel>
            {products.map((p) => (
              <JLabel key={p.slug} asChild className="text-sm text-neutral-600 no-underline hover:text-primary-600"><Link to={`/productos/${p.slug}`} onClick={onCloseMenu}>{p.name}</Link></JLabel>
            ))}
          </JPanel>
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-2">
            <JLabel as="span" className="eyebrow">{ui.nav.services}</JLabel>
            <JPanel variant="ghost" padding="none" radius="none" className="grid grid-cols-1 gap-1.5">
              {services.map((s) => (
                <JLabel key={s.slug} asChild className="text-sm text-neutral-600 no-underline hover:text-primary-600"><Link to={`/servicios/${s.slug}`} onClick={onCloseMenu}>{s.name}</Link></JLabel>
              ))}
            </JPanel>
          </JPanel>
          {secondaryLinks.map((link) => (
            link.href.includes('#')
              ? <JLabel as="a" key={link.href} href={link.href} onClick={onCloseMenu} className="text-sm font-medium text-neutral-600 no-underline">{link.label}</JLabel>
              : <JLabel key={link.href} asChild className="text-sm font-medium text-neutral-600 no-underline"><Link to={link.href} onClick={onCloseMenu}>{link.label}</Link></JLabel>
          ))}
          <JLanguageSwitcher languages={LOCALES} value={locale} onChange={(c) => { setLocale(c as typeof locale); }} className="w-fit" />
          <JButton href={contact.whatsappHref} onClick={onCloseMenu} fullWidth>{ui.nav.bookDiagnostic}</JButton>
        </>
      }
    >
      {homeLink && <JLabel asChild className={navLinkClass}><Link to={homeLink.href}>{homeLink.label}</Link></JLabel>}

      {/* Productos dropdown */}
      <JPanel variant="ghost" padding="none" radius="none" className="relative" onMouseEnter={() => onDropdownEnter('products')} onMouseLeave={onCloseDropdown}>
        <JButton
          variant="ghost"
          icon={<Chevron open={activeDropdown === 'products'} />}
          iconPosition="right"
          className={`gap-1 rounded-lg px-3 py-2 text-sm font-medium ${activeDropdown === 'products' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
          onClick={() => onDropdownToggle('products')} aria-expanded={activeDropdown === 'products'} aria-haspopup="true"
        >
          {ui.nav.products}
        </JButton>
        {activeDropdown === 'products' && (
          <JPanel variant="ghost" padding="none" radius="none" className="absolute left-0 top-full w-80 pt-2">
            <JPanel variant="ghost" padding="none" radius="none" className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
              {products.map((p) => (
                <JLabel key={p.slug} asChild className="flex flex-col gap-0.5 rounded-xl p-3 no-underline transition-colors hover:bg-neutral-50">
                  <Link to={`/productos/${p.slug}`} onClick={onCloseDropdown}>
                    <JPanel as="span" variant="ghost" padding="none" radius="none" className="flex items-center gap-2">
                      <JLabel as="span" className="text-sm font-semibold text-neutral-900">{p.name}</JLabel>
                      <JBadge variant="secondary">{p.tag}</JBadge>
                    </JPanel>
                    <JLabel as="span" className="text-xs leading-relaxed text-neutral-500">{p.outcome}</JLabel>
                  </Link>
                </JLabel>
              ))}
            </JPanel>
          </JPanel>
        )}
      </JPanel>

      {/* Servicios mega dropdown */}
      <JPanel variant="ghost" padding="none" radius="none" className="relative" onMouseEnter={() => onDropdownEnter('services')} onMouseLeave={onCloseDropdown}>
        <JButton
          variant="ghost"
          icon={<Chevron open={activeDropdown === 'services'} />}
          iconPosition="right"
          className={`gap-1 rounded-lg px-3 py-2 text-sm font-medium ${activeDropdown === 'services' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
          onClick={() => onDropdownToggle('services')} aria-expanded={activeDropdown === 'services'} aria-haspopup="true"
        >
          {ui.nav.services}
        </JButton>
        {activeDropdown === 'services' && (
          <JPanel variant="ghost" padding="none" radius="none" className="absolute left-1/2 top-full w-[46rem] max-w-[92vw] -translate-x-1/2 pt-2">
            <JPanel variant="ghost" padding="none" radius="none" className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl md:grid-cols-3">
              {servicesByCategory.map(({ category, items }) => (
                <JPanel key={category} variant="ghost" padding="none" radius="none" className="flex flex-col gap-1.5">
                  <JLabel as="span" className="eyebrow mb-1">{ui.categoryLabels[category] ?? category}</JLabel>
                  {items.map((s) => (
                    <JLabel key={s.slug} asChild className="text-sm text-neutral-600 no-underline transition-colors hover:text-primary-600"><Link to={`/servicios/${s.slug}`} onClick={onCloseDropdown}>{s.name}</Link></JLabel>
                  ))}
                </JPanel>
              ))}
            </JPanel>
          </JPanel>
        )}
      </JPanel>

      {secondaryLinks.map((link) => (
        link.href.includes('#')
          ? <JLabel as="a" key={link.href} href={link.href} className={navLinkClass}>{link.label}</JLabel>
          : <JLabel key={link.href} asChild className={navLinkClass}><Link to={link.href}>{link.label}</Link></JLabel>
      ))}
    </JNavbar>
  );
}
