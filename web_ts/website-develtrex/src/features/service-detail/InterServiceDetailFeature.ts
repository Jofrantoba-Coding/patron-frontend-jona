import type { DeveltrexContent, DeveltrexService } from '../../shared/content/develtrexContent';
import type { ServiceDetail } from '../../shared/content/develtrexDetailContent';

export interface InterServiceDetailFeatureView {
  content: DeveltrexContent;
  service: DeveltrexService;
  detail: ServiceDetail;
}
