import type { InterNavigationFeature } from './InterNavigationFeature';
import { NavigationFeatureView } from './NavigationFeatureView';

export function NavigationFeatureImpl(props: InterNavigationFeature) {
  return <NavigationFeatureView {...props} />;
}
