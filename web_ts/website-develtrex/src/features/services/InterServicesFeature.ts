import type { DeveltrexContent } from '../../shared/content/develtrexContent';

export interface InterServicesFeature {
  content: Pick<DeveltrexContent, 'servicesIntro' | 'services' | 'process' | 'offers' | 'contact'>;
}
