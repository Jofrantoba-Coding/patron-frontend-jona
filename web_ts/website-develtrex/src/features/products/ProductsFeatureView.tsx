import {
  BadgeAtom,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMolecule,
  CardTitle,
  LinkAtom,
  PanelAtom,
  TextAtom,
} from 'jona-ui';
import type { InterProductsFeature } from './InterProductsFeature';

export function ProductsFeatureView({ content }: InterProductsFeature) {
  return (
    <section id="productos" className="section-shell product-section">
      <div className="section-heading">
        <BadgeAtom className="eyebrow">Productos comerciales</BadgeAtom>
        <TextAtom as="h2" className="section-title">
          Soluciones que ya tienen camino de venta
        </TextAtom>
        <TextAtom className="section-copy">
          Convertimos el contenido del sitio original en propuestas claras: ERP, dashboards y formacion aplicada para empresas.
        </TextAtom>
      </div>

      <PanelAtom className="product-showcase" variant="ghost" padding="none">
        {content.products.map((product, index) => (
          <CardMolecule key={product.name} className="product-card business-card">
            <CardHeader>
              <div className={`light-asset product-asset asset-${index + 1}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <BadgeAtom variant="outline">{product.tag}</BadgeAtom>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="business-outcome">{product.outcome}</p>
              <ul className="feature-list">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <LinkAtom href={content.contact.whatsappHref} variant="button" className="card-cta">
                Evaluar oportunidad
              </LinkAtom>
            </CardFooter>
          </CardMolecule>
        ))}
      </PanelAtom>
    </section>
  );
}
