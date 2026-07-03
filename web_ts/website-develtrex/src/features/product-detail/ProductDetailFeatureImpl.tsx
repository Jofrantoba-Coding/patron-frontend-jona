import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useContent, useProductDetails } from '../../i18n';
import { ProductDetailFeatureView } from './ProductDetailFeatureView';

export function ProductDetailFeatureImpl() {
  const { slug } = useParams<{ slug: string }>();
  const develtrexContent = useContent();
  const productDetails = useProductDetails();
  const product = develtrexContent.products.find((item) => item.slug === slug);
  const detail = productDetails.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product || !detail) {
    return <Navigate to="/" replace />;
  }

  const productIndex = develtrexContent.products.findIndex((item) => item.slug === slug);

  return (
    <ProductDetailFeatureView
      content={develtrexContent}
      product={product}
      detail={detail}
      assetClass={`asset-${productIndex + 1}`}
    />
  );
}
