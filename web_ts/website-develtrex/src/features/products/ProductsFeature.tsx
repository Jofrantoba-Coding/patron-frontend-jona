import type { InterProductsFeature } from './InterProductsFeature';
import { ProductsFeatureImpl } from './ProductsFeatureImpl';

export function ProductsFeature(props: InterProductsFeature) {
  return <ProductsFeatureImpl {...props} />;
}
