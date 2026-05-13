import type { InterProductsFeature } from './InterProductsFeature';
import { ProductsFeatureView } from './ProductsFeatureView';

export function ProductsFeatureImpl(props: InterProductsFeature) {
  return <ProductsFeatureView {...props} />;
}
