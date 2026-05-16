import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ContactPageFeature } from '../features/contact-page/ContactPageFeature';
import { HomeFeature } from '../features/home/HomeFeature';
import { ProductDetailFeature } from '../features/product-detail/ProductDetailFeature';
import { ServiceDetailFeature } from '../features/service-detail/ServiceDetailFeature';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeFeature />} />
        <Route path="/contacto" element={<ContactPageFeature />} />
        <Route path="/productos/:slug" element={<ProductDetailFeature />} />
        <Route path="/servicios/:slug" element={<ServiceDetailFeature />} />
      </Routes>
    </BrowserRouter>
  );
}
