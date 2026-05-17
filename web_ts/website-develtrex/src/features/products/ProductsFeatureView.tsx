import { Link } from 'react-router-dom';
import {
  BadgeAtom,
  LinkAtom,
  JPanel,
  TextAtom,
} from 'jona-ui';
import type { InterProductsFeature } from './InterProductsFeature';

export function ProductsFeatureView({ content }: InterProductsFeature) {
  return (
    <JPanel as="section" id="productos" className="products-section" variant="ghost" padding="none" radius="none">
      <JPanel className="section-shell" variant="ghost" padding="none" radius="none">
        <JPanel className="section-heading mb-10" variant="ghost" padding="none" radius="none">
          <TextAtom as="span" className="eyebrow">Producto propio</TextAtom>
          <TextAtom as="h2" className="section-title">Software diseñado para el mercado peruano</TextAtom>
          <TextAtom className="section-copy">
            Desarrollamos y operamos nuestro propio ERP con certificación SUNAT. Una solución lista para usar, con soporte local y sin costo de licencias de terceros.
          </TextAtom>
        </JPanel>

        <JPanel className="product-showcase" variant="ghost" padding="none" radius="none">
          {content.products.map((product, index) => (
            <JPanel key={product.name} className="product-card business-card" variant="ghost" padding="none" radius="none">
              <JPanel className="card-area-header" variant="ghost" padding="none" radius="none">
                <JPanel className={`light-asset product-asset asset-${index + 1}`} variant="ghost" padding="none" radius="none" aria-hidden="true">
                  <JPanel as="span" variant="ghost" padding="none" radius="none" />
                  <JPanel as="span" variant="ghost" padding="none" radius="none" />
                  <JPanel as="span" variant="ghost" padding="none" radius="none" />
                </JPanel>
                <BadgeAtom variant="outline" className="product-tag">{product.tag}</BadgeAtom>
                <TextAtom as="h3" className="card-title">{product.name}</TextAtom>
                <TextAtom className="card-description">{product.description}</TextAtom>
              </JPanel>
              <JPanel className="card-area-content" variant="ghost" padding="none" radius="none">
                <TextAtom className="business-outcome">{product.outcome}</TextAtom>
                <JPanel as="ul" className="feature-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <JPanel as="li" key={highlight} variant="ghost" padding="none" radius="none">
                      <TextAtom as="span">{highlight}</TextAtom>
                    </JPanel>
                  ))}
                </JPanel>
              </JPanel>
              <JPanel className="card-area-footer product-card-actions" variant="ghost" padding="none" radius="none">
                <LinkAtom href={content.contact.whatsappHref} variant="button" className="card-cta">
                  Solicitar demo
                </LinkAtom>
                <Link to={`/productos/${product.slug}`} className="card-detail-link">
                  Ver detalles completos →
                </Link>
              </JPanel>
            </JPanel>
          ))}
        </JPanel>
      </JPanel>
    </JPanel>
  );
}
