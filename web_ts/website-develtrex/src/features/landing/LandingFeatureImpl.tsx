import type { InterLandingFeature } from './InterLandingFeature';
import { LandingFeatureView } from './LandingFeatureView';

export function LandingFeatureImpl(props: InterLandingFeature) {
  return <LandingFeatureView {...props} />;
}
