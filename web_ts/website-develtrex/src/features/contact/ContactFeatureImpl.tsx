import type { InterContactFeature } from './InterContactFeature';
import { ContactFeatureView } from './ContactFeatureView';

export function ContactFeatureImpl(props: InterContactFeature) {
  return <ContactFeatureView {...props} />;
}
