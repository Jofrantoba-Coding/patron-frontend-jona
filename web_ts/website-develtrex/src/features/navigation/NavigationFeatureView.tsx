import { type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { DrawerMolecule, IconButtonAtom, ImageAtom, LinkAtom, PanelAtom } from 'jona-ui';
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
  onDropdownLeave: () => void;
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
  onDropdownEnter, onDropdownToggle, onDropdownLeave, onCloseDropdown,
}: InterNavigationFeatureView) {
  const servicesByCategory = SERVICE_CATEGORIES.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }));
  const homeLink = content.links.find((link) => link.label === 'Inicio');
  const secondaryLinks = content.links.filter((link) => link.label !== 'Inicio');

  return (
    <header className="site-header" ref={navRef as RefObject<HTMLDivElement>}>
      <nav className="nav-shell" aria-label="Navegación principal">

        <IconButtonAtom
          icon={<MenuIcon />}
          label="Abrir menú"
          variant="ghost"
          className="nav-hamburger"
          onClick={onToggleMenu}
        />

        <Link to="/" className="brand-mark" aria-label="Develtrex inicio">
          <ImageAtom className="brand-symbol" src="/assets/develtrex-logo.svg" alt="" aria-hidden="true" loading="eager" />
          <span className="brand-name">{content.brand}</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links">
          {homeLink ? (
            <Link to={homeLink.href} className="nav-link">
              {homeLink.label}
            </Link>
          ) : null}

          {/* Productos — full-width mega menu */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => onDropdownEnter('products')}
            onMouseLeave={onDropdownLeave}
          >
            <button
              className={`nav-link nav-dropdown-trigger${activeDropdown === 'products' ? ' active' : ''}`}
              onClick={() => onDropdownToggle('products')}
              aria-expanded={activeDropdown === 'products'}
              aria-haspopup="true"
            >
              Productos <ChevronIcon open={activeDropdown === 'products'} />
            </button>

            <div className={`nav-dropdown-panel${activeDropdown === 'products' ? ' open' : ''}`}>
              <div className="dropdown-inner">
                <div className="dropdown-header">
                  <strong className="dropdown-label">Producto</strong>
                  <span className="dropdown-sub">ERP Softcommerce para facturación, inventario, contabilidad y tesorería</span>
                </div>
                <div className="products-mega-grid">
                  {products.map((p) => (
                    <Link key={p.slug} to={`/productos/${p.slug}`} className="mega-item" onClick={onCloseDropdown}>
                      <strong className="mega-item-name">{p.name}</strong>
                      <span className="mega-item-sub">{p.outcome}</span>
                      <span className="mega-item-tag">{p.tag}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Servicios — full-width mega menu */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => onDropdownEnter('services')}
            onMouseLeave={onDropdownLeave}
          >
            <button
              className={`nav-link nav-dropdown-trigger${activeDropdown === 'services' ? ' active' : ''}`}
              onClick={() => onDropdownToggle('services')}
              aria-expanded={activeDropdown === 'services'}
              aria-haspopup="true"
            >
              Servicios <ChevronIcon open={activeDropdown === 'services'} />
            </button>

            <div className={`nav-dropdown-panel${activeDropdown === 'services' ? ' open' : ''}`}>
              <div className="dropdown-inner">
                <div className="dropdown-header">
                  <strong className="dropdown-label">Portafolio de servicios</strong>
                  <span className="dropdown-sub">Desarrollo, cloud, datos, seguridad y operación tecnológica</span>
                </div>
                <div className="services-mega-grid">
                  {servicesByCategory.map(({ category, items }) => (
                    <div key={category} className="services-category">
                      <span className="services-cat-label">{category}</span>
                      <div className="services-cat-items">
                        {items.map((s) => (
                          <Link key={s.slug} to={`/servicios/${s.slug}`} className="mega-service-item" onClick={onCloseDropdown}>
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regular links — hash anchors use <a> so the browser scrolls natively */}
          {secondaryLinks.map((link) => (
            link.href.includes('#')
              ? <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
              : <Link key={link.href} to={link.href} className="nav-link">{link.label}</Link>
          ))}
        </div>

        <LinkAtom href={contact.whatsappHref} variant="button" className="nav-action">
          Agendar
        </LinkAtom>
      </nav>

      {/* Mobile drawer — adaptive layout */}
      <DrawerMolecule
        open={isMenuOpen}
        onClose={onCloseMenu}
        side="left"
        title="Develtrex"
        size="sm"
        showCloseButton
      >
        <PanelAtom variant="ghost" padding="none" layout="flow" direction="column" gap="md">
          {homeLink ? (
            <Link to={homeLink.href} className="drawer-nav-link" onClick={onCloseMenu}>
              {homeLink.label}
            </Link>
          ) : null}

          {/* Products */}
          <div className="drawer-section">
            <span className="drawer-section-label">Productos</span>
            {products.map((p) => (
              <Link key={p.slug} to={`/productos/${p.slug}`} className="drawer-nav-link" onClick={onCloseMenu}>
                {p.name}
              </Link>
            ))}
          </div>

          {/* Services — 2-col grid */}
          <div className="drawer-section">
            <span className="drawer-section-label">Servicios</span>
            <div className="drawer-services-grid">
              {services.map((s) => (
                <Link key={s.slug} to={`/servicios/${s.slug}`} className="drawer-nav-link drawer-nav-link-sm" onClick={onCloseMenu}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Regular links */}
          {secondaryLinks.map((link) => (
            link.href.includes('#')
              ? <a key={link.href} href={link.href} className="drawer-nav-link" onClick={onCloseMenu}>{link.label}</a>
              : <Link key={link.href} to={link.href} className="drawer-nav-link" onClick={onCloseMenu}>{link.label}</Link>
          ))}

          <LinkAtom href={contact.whatsappHref} variant="button" className="drawer-nav-action" onClick={onCloseMenu}>
            Agendar diagnóstico
          </LinkAtom>
        </PanelAtom>
      </DrawerMolecule>
    </header>
  );
}
