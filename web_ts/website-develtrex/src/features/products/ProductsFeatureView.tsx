import { Link } from 'react-router-dom';
import {
  BadgeAtom,
  CardContent,
  CardFooter,
  CardHeader,
  CardMolecule,
  CardTitle,
  CardDescription,
  GridLayout,
  LinkAtom,
  PanelAtom,
  SectionHeadingMolecule,
  SectionShellAtom,
  TextAtom,
} from 'jona-ui';
import type { InterProductsFeature } from './InterProductsFeature';

export function ProductsFeatureView({ content }: InterProductsFeature) {
  return (
    <section id="productos" className="products-section">
      <SectionShellAtom>
        <SectionHeadingMolecule
          eyebrow="Producto propio"
          heading="Software diseñado para el mercado peruano"
          description="Desarrollamos y operamos nuestro propio ERP con certificación SUNAT. Una solución lista para usar, con soporte local y sin costo de licencias de terceros."
          className="mb-10"
        />

        <GridLayout autoFitMin="340px" gap="lg" className="product-showcase">
          {content.products.map((product, index) => (
            <CardMolecule key={product.name} className="product-card">
              <CardHeader>
                <PanelAtom className={`light-asset product-asset asset-${index + 1}`} variant="ghost" padding="none" radius="none" aria-hidden="true">
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                  <PanelAtom as="span" variant="ghost" padding="none" radius="none" />
                </PanelAtom>
                <BadgeAtom variant="outline" className="product-tag">{product.tag}</BadgeAtom>
                <CardTitle className="card-title">{product.name}</CardTitle>
                <CardDescription className="card-description">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <TextAtom className="business-outcome">{product.outcome}</TextAtom>
                <PanelAtom as="ul" className="feature-list" variant="ghost" padding="none" radius="none">
                  {product.highlights.map((highlight) => (
                    <PanelAtom as="li" key={highlight} variant="ghost" padding="none" radius="none">
                      <TextAtom as="span">{highlight}</TextAtom>
                    </PanelAtom>
                  ))}
                </PanelAtom>
              </CardContent>
              <CardFooter>
                <div className="product-card-actions">
                  <LinkAtom href={content.contact.whatsappHref} variant="button" className="card-cta">
                    Solicitar demo
                  </LinkAtom>
                  <Link to={`/productos/${product.slug}`} className="card-detail-link">
                    Ver detalles completos →
                  </Link>
                </div>
              </CardFooter>
            </CardMolecule>
          ))}
        </GridLayout>
      </SectionShellAtom>
    </section>
  );
}
