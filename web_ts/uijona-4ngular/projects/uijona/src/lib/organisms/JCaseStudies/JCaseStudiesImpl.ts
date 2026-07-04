import { J_CASE_STUDIES_TEMPLATE } from './JCaseStudiesView';
import type { CaseStudyMetric, CaseStudyItem, InterJCaseStudies } from './InterJCaseStudies';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import { JSectionHeading } from '../../molecules/JSectionHeading';

const CARD_CLASS =
  'group flex min-w-0 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg';

/** JCaseStudies — grilla de casos de estudio con métricas y tags. */
@Component({
  selector: 'j-case-studies',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, NgTemplateOutlet],
  host: { class: 'contents' },
  template: J_CASE_STUDIES_TEMPLATE,
})
export class JCaseStudies {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly items = input.required<CaseStudyItem[]>();
  readonly className = input<string>('');
  protected readonly cn = cn;
  protected readonly cardClass = CARD_CLASS;
}
