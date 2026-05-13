import type { DeveltrexContent } from '../../shared/content/develtrexContent';

export interface InterProductsFeature {
  content: Pick<DeveltrexContent, 'products' | 'contact'>;
}
