// JStepperView.ts — JONA View (template puro)
export const J_STEPPER_TEMPLATE = `
    <ol [class]="listClasses()">
      @for (step of steps(); track step.id; let i = $index) {
        <li
          [class]="itemClasses(step)"
          [attr.aria-current]="status(i) === 'current' ? 'step' : null"
        >
          @if (allowStepClick() && !step.disabled) {
            <button
              type="button"
              [disabled]="step.disabled"
              (click)="onStepClick(i, step)"
              class="flex min-w-0 gap-3 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ step, i }" />
            </button>
          } @else {
            <div class="flex min-w-0 gap-3">
              <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ step, i }" />
            </div>
          }
        </li>
      }
    </ol>

    <ng-template #content let-step="step" let-i="i">
      <span [class]="indicatorClasses(i, step)">
        @if (status(i) === 'complete') {
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m20 6-11 11-5-5" />
          </svg>
        } @else {
          {{ i + 1 }}
        }
      </span>
      <span class="min-w-0">
        <span
          [class]="
            cn('block break-words text-sm font-medium', status(i) === 'current' ? 'text-neutral-900' : 'text-neutral-700')
          "
          >{{ step.label }}</span
        >
        @if (step.description) {
          <span class="mt-0.5 block break-words text-sm text-neutral-500">{{ step.description }}</span>
        }
      </span>
    </ng-template>
  `;

