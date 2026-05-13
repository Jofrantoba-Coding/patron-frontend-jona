import type { InterServicesFeature } from './InterServicesFeature';
import { ServicesFeatureImpl } from './ServicesFeatureImpl';

export function ServicesFeature(props: InterServicesFeature) {
  return <ServicesFeatureImpl {...props} />;
}
