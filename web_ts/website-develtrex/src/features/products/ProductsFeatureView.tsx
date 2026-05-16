import { Link } from 'react-router-dom';
import {
  BadgeAtom,
  LinkAtom,
  PanelAtom,
  TextAtom,
} from 'jona-ui';
import type { InterProductsFeature } from './InterProductsFeature';

export function ProductsFeatureView({ content }: InterProductsFeature) {
  return (
    <PanelAtom as="section" id="productos" className="products-section" variant="ghost" padding="none" radius="none">
      <PanelAtom className="section-shell" variant="ghost" padding="none" radius="none">
        <PanelAtom className="section-heading mb-10" variant="ghost" padding="none" radius="none">
          <TextAtom as="span" className="eyebrow">Producto propio</TextAtom>
          <TextAtom as="h2" className="section-title">Software diseñado para el mercado peruano</TextAtom>
          <TextAtom className="section-copy">
            Desarrollamos y operamos nuestro propio ERP con certificación SUNAT. Una solución lista para usar, con soporte local y sin costo de licencias de terceros.
          </TextAtom>
        </PanelAtom>

        <PanelAtom className="product-showcase" variant="ghost" padding="none" radius="none">
          {content.products.map((product, index) => (
            <PanelAtom key={product.name} className="product-card business-card" variant="ghost" padding="none" radius="none">
              <PanelAtom className="card-area-header" variant="ghost" padding="none" radius="none">
                <PanelAtom className={`light-asset product-asset asset-${index + 1}`} variant="ghost" padding="none" radius="none" aria-hidden="true">
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                </PanelAtom>
                <BadgeAtom variant="outline" className="product-tag">{product.tag}</BadgeAtom>
                <TextAtom as="h3" className="card-title">{product.name}</TextAtom>
                <TextAtom className="card-description">{product.description}</TextAtom>
              </PanelAtom>
              <PanelAtom className="card-area-content" variant="ghost" padding="none" radius="none">
                <TextAtom className="business-outcome">{product.outcome}</TextAtom>
                <PanelAtom as="ul" className="feature-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <PanelAtom as="li" key={highlight} variant="ghost" padding="none" radius="none">
                      <TextAtom as="span">{highlight}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </PanelAtom>
              <PanelAtom className="card-area-footer product-card-actions" variant="ghost" padding="none" radius="none">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="card-cta">
                  Solicitar demo
                </LinkAtom>
                <Link to={`/productos/${product.slug}`} className="card-detail-link">
                  Ver detalles completos →
                </Link>
              </PanelAtom>
            </PanelAtom>
          ))}
        </PanelAtom>
      </PanelAtom>
    </PanelAtom>
  );
}
