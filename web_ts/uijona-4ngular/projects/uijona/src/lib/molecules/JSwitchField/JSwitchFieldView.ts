// JSwitchFieldView.ts — JONA View (template puro)
export const J_SWITCH_FIELD_TEMPLATE = `
    @if (card()) {
      <div [class]="cardClasses()" (click)="onCardClick()">
        <ng-container [ngTemplateOutlet]="inner" />
      </div>
    } @else {
      <div [class]="cn('flex flex-col gap-1', className())">
        <ng-container [ngTemplateOutlet]="inner" />
      </div>
    }

    <ng-template #inner>
      <div class="flex items-center justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-0.5">
          <j-label
            variant="label"
            [htmlFor]="id()"
            [message]="label()"
            [className]="cn('cursor-pointer', disabled() && 'opacity-50')"
          />
          @if (description() && !hasError()) {
            <j-label [message]="description()!" variant="description" />
          }
          @if (hasError()) {
            <j-label [message]="errorMessage()!" variant="error" />
          }
        </div>
        <j-switch
          [id]="id()"
          [checked]="checked()"
          [disabled]="disabled()"
          [hasError]="hasError()"
          [size]="size()"
          (toggled)="onToggle($event.checked)"
        />
      </div>
    </ng-template>
  `;

