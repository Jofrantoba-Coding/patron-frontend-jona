import type { InterNavigationFeature } from './InterNavigationFeature';
import { NavigationFeatureImpl } from './NavigationFeatureImpl';

export function NavigationFeature(props: InterNavigationFeature) {
  return <NavigationFeatureImpl {...props} />;
}
