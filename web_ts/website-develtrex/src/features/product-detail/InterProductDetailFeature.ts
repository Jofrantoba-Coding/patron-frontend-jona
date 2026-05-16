import type { DeveltrexContent, DeveltrexProduct } from '../../shared/content/develtrexContent';
import type { ProductDetail } from '../../shared/content/develtrexDetailContent';

export interface InterProductDetailFeatureView {
  content: DeveltrexContent;
  product: DeveltrexProduct;
  detail: ProductDetail;
  assetClass: string;
}
