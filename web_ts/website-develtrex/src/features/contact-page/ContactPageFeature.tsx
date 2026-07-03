import { useContent } from '../../i18n';
import { ContactPageFeatureView } from './ContactPageFeatureView';

export function ContactPageFeature() {
  const content = useContent();
  return <ContactPageFeatureView content={content} />;
}
