// JFooterPageView.ts — JONA View (template puro)
export const J_FOOTER_PAGE_TEMPLATE = `
    <footer [class]="classes()">
      <div class="min-w-0 flex-1 break-words md:flex-none">
        <span class="jfp-left"><ng-content select="[jLeft]" /></span>
        <span class="jfp-left-text">{{ text() }}</span>
      </div>
      <div class="jfp-center hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex">
        <ng-content select="[jCenter]" />
      </div>
      <div class="jfp-right flex shrink-0 items-center gap-2"><ng-content select="[jRight]" /></div>
    </footer>
  `;

export const J_FOOTER_PAGE_STYLES = [
    `
      .jfp-left:empty {
        display: none;
      }
      .jfp-left:not(:empty) + .jfp-left-text {
        display: none;
      }
      .jfp-center:empty {
        display: none;
      }
      .jfp-right:empty {
        display: none;
      }
    `,
  ];

