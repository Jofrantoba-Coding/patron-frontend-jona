// JBreadcrumbView.ts — JONA View (template puro)
export const J_BREADCRUMB_TEMPLATE_1 = `<nav aria-label="breadcrumb" [class]="cn('flex', className())"><ng-content /></nav>`;

export const J_BREADCRUMB_TEMPLATE_2 = `<ol [class]="classes()"><ng-content /></ol>`;

export const J_BREADCRUMB_TEMPLATE_3 = `<li [class]="cn('inline-flex items-center gap-1.5', className())"><ng-content /></li>`;

export const J_BREADCRUMB_TEMPLATE_4 = `
    <a
      [href]="href() ?? '#'"
      [class]="cn('transition-colors hover:text-neutral-900 cursor-pointer', className())"
      (click)="onClick($event)"
    >
      <ng-content />
    </a>
  `;

export const J_BREADCRUMB_TEMPLATE_5 = `
    <span role="link" aria-current="page" aria-disabled="true" [class]="cn('font-medium text-neutral-900', className())">
      <ng-content />
    </span>
  `;

export const J_BREADCRUMB_TEMPLATE_6 = `
    <li role="presentation" aria-hidden="true" [class]="cn('text-neutral-400 select-none', className())">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </li>
  `;

export const J_BREADCRUMB_TEMPLATE_7 = `
    <span
      role="presentation"
      aria-hidden="true"
      [class]="cn('flex h-5 w-5 items-center justify-center text-neutral-400', className())"
      >···</span
    >
  `;

