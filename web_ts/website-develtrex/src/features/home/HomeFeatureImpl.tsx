import type { InterHomeFeature } from './InterHomeFeature';
import { HomeFeatureView } from './HomeFeatureView';

export function HomeFeatureImpl(props: InterHomeFeature) {
  return <HomeFeatureView {...props} />;
}
