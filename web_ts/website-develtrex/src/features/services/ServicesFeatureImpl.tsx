import type { InterServicesFeature } from './InterServicesFeature';
import { ServicesFeatureView } from './ServicesFeatureView';

export function ServicesFeatureImpl(props: InterServicesFeature) {
  return <ServicesFeatureView {...props} />;
}
