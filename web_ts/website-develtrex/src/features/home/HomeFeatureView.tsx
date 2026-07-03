import { JCaseStudies, JPanel } from 'jona-ui';
import { useUi } from '../../i18n';
import { ContactFeature } from '../contact/ContactFeature';
import { LandingFeature } from '../landing/LandingFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import { ProductsFeature } from '../products/ProductsFeature';
import { ServicesFeature } from '../services/ServicesFeature';
import type { InterHomeFeature } from './InterHomeFeature';

export function HomeFeatureView({ content }: InterHomeFeature) {
  const ui = useUi();
  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />
      <JPanel as="main" variant="ghost" padding="none" radius="none">
        <LandingFeature content={content} />
        <ProductsFeature content={content} />
        <ServicesFeature content={content} />
        <JCaseStudies
          eyebrow={ui.cases.eyebrow}
          heading={ui.cases.heading}
          description={ui.cases.description}
          items={ui.cases.items}
        />
        <ContactFeature content={content.contact} />
      </JPanel>
    </>
  );
}
