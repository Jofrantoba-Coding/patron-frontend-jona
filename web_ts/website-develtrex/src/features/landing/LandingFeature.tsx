import type { InterLandingFeature } from './InterLandingFeature';
import { LandingFeatureImpl } from './LandingFeatureImpl';

export function LandingFeature(props: InterLandingFeature) {
  return <LandingFeatureImpl {...props} />;
}
