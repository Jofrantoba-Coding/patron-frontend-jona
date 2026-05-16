import { PanelAtom } from 'jona-ui';
import { LandingFeature } from '../landing/LandingFeature';
import { NavigationFeature } from '../navigation/NavigationFeature';
import { ProductsFeature } from '../products/ProductsFeature';
import { ServicesFeature } from '../services/ServicesFeature';
import type { InterHomeFeature } from './InterHomeFeature';

export function HomeFeatureView({ content }: InterHomeFeature) {
  return (
    <>
      <NavigationFeature
        content={content.navigation}
        contact={content.contact}
        products={content.products}
        services={content.services}
      />
      <PanelAtom as="main" variant="ghost" padding="none" radius="none">
        <LandingFeature content={content} />
        <ProductsFeature content={content} />
        <ServicesFeature content={content} />
      </PanelAtom>
    </>
  );
}
