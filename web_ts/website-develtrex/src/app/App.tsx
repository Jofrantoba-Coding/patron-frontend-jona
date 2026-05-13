import { ContactFeature } from '../features/contact/ContactFeature';
import { LandingFeature } from '../features/landing/LandingFeature';
import { NavigationFeature } from '../features/navigation/NavigationFeature';
import { ProductsFeature } from '../features/products/ProductsFeature';
import { ServicesFeature } from '../features/services/ServicesFeature';
import { develtrexContent } from '../shared/content/develtrexContent';

export function App() {
  return (
    <>
      <NavigationFeature content={develtrexContent.navigation} contact={develtrexContent.contact} />
      <main>
        <LandingFeature content={develtrexContent} />
        <ProductsFeature content={develtrexContent} />
        <ServicesFeature content={develtrexContent} />
        <ContactFeature content={develtrexContent.contact} />
      </main>
    </>
  );
}
