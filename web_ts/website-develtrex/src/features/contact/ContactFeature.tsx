import type { InterContactFeature } from './InterContactFeature';
import { ContactFeatureImpl } from './ContactFeatureImpl';

export function ContactFeature(props: InterContactFeature) {
  return <ContactFeatureImpl {...props} />;
}
