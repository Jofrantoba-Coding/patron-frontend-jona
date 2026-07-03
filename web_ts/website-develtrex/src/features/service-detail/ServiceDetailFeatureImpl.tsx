import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useContent, useServiceDetails } from '../../i18n';
import { ServiceDetailFeatureView } from './ServiceDetailFeatureView';

export function ServiceDetailFeatureImpl() {
  const { slug } = useParams<{ slug: string }>();
  const develtrexContent = useContent();
  const serviceDetails = useServiceDetails();
  const service = develtrexContent.services.find((item) => item.slug === slug);
  const detail = serviceDetails.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service || !detail) {
    return <Navigate to="/" replace />;
  }

  return <ServiceDetailFeatureView content={develtrexContent} service={service} detail={detail} />;
}
