// JHeaderPageView.ts — JONA View (template puro)
export const J_HEADER_PAGE_TEMPLATE = `
    <header [class]="classes()">
      <div class="min-w-0 flex-1 truncate text-lg font-semibold text-primary-600 md:flex-none">
        <span class="jhp-title"><ng-content select="[jTitle]" /></span>
        <span class="jhp-title-text">{{ title() }}</span>
      </div>
      <nav class="jhp-nav hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto text-sm text-neutral-600 md:flex">
        <ng-content select="[jNav]" />
      </nav>
      <div class="jhp-actions flex shrink-0 items-center gap-2"><ng-content select="[jActions]" /></div>
    </header>
  `;

export const J_HEADER_PAGE_STYLES = [
    `
      .jhp-title:empty {
        display: none;
      }
      .jhp-title:not(:empty) + .jhp-title-text {
        display: none;
      }
      .jhp-nav:empty {
        display: none;
      }
      .jhp-actions:empty {
        display: none;
      }
    `,
  ];

