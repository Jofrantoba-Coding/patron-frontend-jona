import { useContent } from '../../i18n';
import { HomeFeatureImpl } from './HomeFeatureImpl';

export function HomeFeature() {
  const content = useContent();
  return <HomeFeatureImpl content={content} />;
}
