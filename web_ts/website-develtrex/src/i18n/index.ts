import { develtrexContent, type DeveltrexContent } from '../shared/content/develtrexContent';
import { develtrexContentEn } from '../shared/content/develtrexContent.en';
import { serviceDetails, productDetails, type ServiceDetail, type ProductDetail } from '../shared/content/develtrexDetailContent';
import { serviceDetailsEn, productDetailsEn } from '../shared/content/develtrexDetailContent.en';
import { UI_STRINGS, type UiStrings } from './strings';
import { useLocale, type Locale } from './LocaleProvider';

const CONTENT: Record<Locale, DeveltrexContent> = {
  es: develtrexContent,
  en: develtrexContentEn,
};

const SERVICE_DETAILS: Record<Locale, ServiceDetail[]> = {
  es: serviceDetails,
  en: serviceDetailsEn,
};
const PRODUCT_DETAILS: Record<Locale, ProductDetail[]> = {
  es: productDetails,
  en: productDetailsEn,
};

export function useContent(): DeveltrexContent {
  const { locale } = useLocale();
  return CONTENT[locale] ?? CONTENT.es;
}

export function useUi(): UiStrings {
  const { locale } = useLocale();
  return UI_STRINGS[locale] ?? UI_STRINGS.es;
}

export function useServiceDetails(): ServiceDetail[] {
  const { locale } = useLocale();
  return SERVICE_DETAILS[locale] ?? SERVICE_DETAILS.es;
}

export function useProductDetails(): ProductDetail[] {
  const { locale } = useLocale();
  return PRODUCT_DETAILS[locale] ?? PRODUCT_DETAILS.es;
}

export { useLocale, LOCALES, type Locale } from './LocaleProvider';
