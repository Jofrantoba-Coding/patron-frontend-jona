// JAccordionView.ts — JONA View (template puro)
export const J_ACCORDION_TEMPLATE = `
    <div [class]="containerClasses()" [style]="style()">
      @for (item of items(); track item.value) {
        <div [class]="itemClass()">
          <h3>
            <button
              [id]="'jaccordion-trigger-' + item.value"
              type="button"
              [attr.aria-expanded]="isOpen(item.value)"
              [attr.aria-controls]="'jaccordion-panel-' + item.value"
              [disabled]="item.disabled"
              (click)="toggle(item)"
              [class]="triggerClass()"
            >
              <span class="flex min-w-0 items-center gap-2">
                @if (item.icon) {
                  <span class="shrink-0 text-neutral-500" aria-hidden="true">{{ item.icon }}</span>
                }
                <span class="truncate">{{ item.title }}</span>
              </span>
              <span
                aria-hidden="true"
                [class]="cn('shrink-0 text-neutral-400 transition-transform duration-200', isOpen(item.value) && 'rotate-180')"
                >▾</span
              >
            </button>
          </h3>
          <div
            [id]="'jaccordion-panel-' + item.value"
            role="region"
            [attr.aria-labelledby]="'jaccordion-trigger-' + item.value"
            [attr.aria-hidden]="!isOpen(item.value)"
            [style.display]="'grid'"
            [style.grid-template-rows]="isOpen(item.value) ? '1fr' : '0fr'"
            style="transition: grid-template-rows 200ms ease;"
          >
            <div class="overflow-hidden">
              <div [class]="contentClass()">{{ item.content }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `;

