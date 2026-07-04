export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyItem {
  sector?: string;
  title: string;
  outcome: string;
  metrics?: CaseStudyMetric[];
  tags?: string[];
  href?: string;
  linkLabel?: string;
}

/** Contrato publico de JCaseStudies. */
export interface InterJCaseStudies {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: CaseStudyItem[];
}
