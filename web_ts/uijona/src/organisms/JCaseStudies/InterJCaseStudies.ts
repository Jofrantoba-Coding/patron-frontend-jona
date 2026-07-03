// InterJCaseStudies.ts — JONA Interface

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyItem {
  /** Sector o industria del cliente, p.ej. "Fintech". */
  sector?: string;
  title: string;
  /** Resultado medible logrado. */
  outcome: string;
  /** Métricas destacadas del caso. */
  metrics?: CaseStudyMetric[];
  /** Etiquetas de tecnología/servicio. */
  tags?: string[];
  href?: string;
  linkLabel?: string;
}

export interface InterJCaseStudies {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: CaseStudyItem[];
  as?: 'section' | 'div';
  className?: string;
}

export const JCASE_STUDIES_DEFAULTS = {
  as: 'section',
} as const satisfies Partial<InterJCaseStudies>;
