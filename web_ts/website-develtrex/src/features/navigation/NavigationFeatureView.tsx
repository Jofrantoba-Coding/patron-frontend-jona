import { type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { DrawerMolecule, IconButtonAtom, ImageAtom, LinkAtom, JPanel, TextAtom } from 'jona-ui';
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

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="6" x2="20" y2="6" />
    <line x1="2" y1="11" x2="20" y2="11" />
    <line x1="2" y1="16" x2="20" y2="16" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
  >
    <polyline points="2 5 7 10 12 5" />
  </svg>
);

const SERVICE_CATEGORIES = [
  'Desarrollo Digital',
  'Cloud & Arquitectura',
  'Plataforma & DevOps',
  'Datos & IA',
  'Seguridad & Operaciones',
] as const;

export function NavigationFeatureView({
  content, contact, products, services,
  navRef, isMenuOpen, activeDropdown,
  onToggleMenu, onCloseMenu,
  onDropdownEnter, onDropdownToggle, onCloseDropdown,
}: InterNavigationFeatureView) {
  const servicesByCategory = SERVICE_CATEGORIES.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }));
  const homeLink = content.links.find((link) => link.label === 'Inicio');
  const secondaryLinks = content.links.filter((link) => link.label !== 'Inicio');

  return (
    <JPanel as="header" className="site-header" variant="ghost" padding="none" radius="none" ref={navRef as RefObject<HTMLDivElement>}>
      <JPanel as="nav" className="nav-shell" variant="ghost" padding="none" radius="none" aria-label="Navegación principal">

        <IconButtonAtom
          icon={<MenuIcon />}
          label="Abrir menú"
          variant="ghost"
          className="nav-hamburger"
          onClick={onToggleMenu}
        />

        <Link to="/" className="brand-mark" aria-label="Develtrex inicio">
          <ImageAtom className="brand-symbol" src="/assets/develtrex-logo.svg" alt="" aria-hidden="true" loading="eager" />
          <TextAtom as="span" className="brand-name">{content.brand}</TextAtom>
        </Link>

        <JPanel className="nav-links" variant="ghost" padding="none" radius="none">
          {homeLink ? (
            <Link to={homeLink.href} className="nav-link">
              {homeLink.label}
            </Link>
          ) : null}

          <JPanel
            className="nav-dropdown-wrapper"
            variant="ghost"
            padding="none"
            radius="none"
            onMouseEnter={() => onDropdownEnter('products')}
          >
            <button
              className={`nav-link nav-dropdown-trigger${activeDropdown === 'products' ? ' active' : ''}`}
              onClick={() => onDropdownToggle('products')}
              aria-expanded={activeDropdown === 'products'}
              aria-haspopup="true"
            >
              Productos <ChevronIcon open={activeDropdown === 'products'} />
            </button>

            <JPanel className={`nav-dropdown-panel${activeDropdown === 'products' ? ' open' : ''}`} variant="ghost" padding="none" radius="none">
              <JPanel className="dropdown-inner" variant="ghost" padding="none" radius="none">
                <JPanel className="dropdown-header" variant="ghost" padding="none" radius="none">
                  <TextAtom as="strong" className="dropdown-label">Producto</TextAtom>
                  <TextAtom as="span" className="dropdown-sub">ERP Softcommerce para facturación, inventario, contabilidad y tesorería</TextAtom>
                </JPanel>
                <JPanel className="products-mega-grid" variant="ghost" padding="none" radius="none">
                  {products.map((p) => (
                    <Link key={p.slug} to={`/productos/${p.slug}`} className="mega-item" onClick={onCloseDropdown}>
                      <TextAtom as="strong" className="mega-item-name">{p.name}</TextAtom>
                      <TextAtom as="span" className="mega-item-sub">{p.outcome}</TextAtom>
                      <TextAtom as="span" className="mega-item-tag">{p.tag}</TextAtom>
                    </Link>
                  ))}
                </JPanel>
              </JPanel>
            </JPanel>
          </JPanel>

          <JPanel
            className="nav-dropdown-wrapper"
            variant="ghost"
            padding="none"
            radius="none"
            onMouseEnter={() => onDropdownEnter('services')}
          >
            <button
              className={`nav-link nav-dropdown-trigger${activeDropdown === 'services' ? ' active' : ''}`}
              onClick={() => onDropdownToggle('services')}
              aria-expanded={activeDropdown === 'services'}
              aria-haspopup="true"
            >
              Servicios <ChevronIcon open={activeDropdown === 'services'} />
            </button>

            <JPanel className={`nav-dropdown-panel${activeDropdown === 'services' ? ' open' : ''}`} variant="ghost" padding="none" radius="none">
              <JPanel className="dropdown-inner" variant="ghost" padding="none" radius="none">
                <JPanel className="dropdown-header" variant="ghost" padding="none" radius="none">
                  <TextAtom as="strong" className="dropdown-label">Portafolio de servicios</TextAtom>
                  <TextAtom as="span" className="dropdown-sub">Desarrollo, cloud, datos, seguridad y operación tecnológica</TextAtom>
                </JPanel>
                <JPanel className="services-mega-grid" variant="ghost" padding="none" radius="none">
                  {servicesByCategory.map(({ category, items }) => (
                    <JPanel key={category} className="services-category" variant="ghost" padding="none" radius="none">
                      <TextAtom as="span" className="services-cat-label">{category}</TextAtom>
                      <JPanel className="services-cat-items" variant="ghost" padding="none" radius="none">
                        {items.map((s) => (
                          <Link key={s.slug} to={`/servicios/${s.slug}`} className="mega-service-item" onClick={onCloseDropdown}>
                            {s.name}
                          </Link>
                        ))}
                      </JPanel>
                    </JPanel>
                  ))}
                </JPanel>
              </JPanel>
            </JPanel>
          </JPanel>

          {secondaryLinks.map((link) => (
            link.href.includes('#')
              ? <LinkAtom key={link.href} href={link.href} className="nav-link">{link.label}</LinkAtom>
              : <Link key={link.href} to={link.href} className="nav-link">{link.label}</Link>
          ))}
        </JPanel>

        <LinkAtom href={contact.whatsappHref} variant="button" className="nav-action">
          Agendar
        </LinkAtom>
      </JPanel>

      {/* Mobile drawer — adaptive layout */}
      <DrawerMolecule
        open={isMenuOpen}
        onClose={onCloseMenu}
        side="left"
        title="Develtrex"
        size="sm"
        showCloseButton
      >
        <JPanel variant="ghost" padding="none" layout="flow" direction="column" gap="md">
          {homeLink ? (
            <Link to={homeLink.href} className="drawer-nav-link" onClick={onCloseMenu}>
              {homeLink.label}
            </Link>
          ) : null}

          <JPanel className="drawer-section" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="drawer-section-label">Productos</TextAtom>
            {products.map((p) => (
              <Link key={p.slug} to={`/productos/${p.slug}`} className="drawer-nav-link" onClick={onCloseMenu}>
                {p.name}
              </Link>
            ))}
          </JPanel>

          <JPanel className="drawer-section" variant="ghost" padding="none" radius="none">
            <TextAtom as="span" className="drawer-section-label">Servicios</TextAtom>
            <JPanel className="drawer-services-grid" variant="ghost" padding="none" radius="none">
              {services.map((s) => (
                <Link key={s.slug} to={`/servicios/${s.slug}`} className="drawer-nav-link drawer-nav-link-sm" onClick={onCloseMenu}>
                  {s.name}
                </Link>
              ))}
            </JPanel>
          </JPanel>

          {secondaryLinks.map((link) => (
            link.href.includes('#')
              ? <LinkAtom key={link.href} href={link.href} className="drawer-nav-link" onClick={onCloseMenu}>{link.label}</LinkAtom>
              : <Link key={link.href} to={link.href} className="drawer-nav-link" onClick={onCloseMenu}>{link.label}</Link>
          ))}

          <LinkAtom href={contact.whatsappHref} variant="button" className="drawer-nav-action" onClick={onCloseMenu}>
            Agendar diagnóstico
          </LinkAtom>
        </JPanel>
      </DrawerMolecule>
    </JPanel>
  );
}
