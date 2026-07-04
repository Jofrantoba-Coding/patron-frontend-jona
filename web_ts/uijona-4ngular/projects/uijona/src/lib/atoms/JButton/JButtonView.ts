// JButtonView.ts — JONA View (template puro)
export const J_BUTTON_TEMPLATE = `
    @if (href(); as link) {
      <a
        [href]="link"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.target]="target()"
        [attr.rel]="rel() ?? (target() === '_blank' ? 'noopener noreferrer' : null)"
        [attr.aria-disabled]="disabled() || loading() ? true : null"
        [attr.data-jbutton-icon-position]="iconPosition()"
        [attr.data-jbutton-full-width]="fullWidth() ? 'true' : null"
        [style]="style()"
        [class]="classes()"
        (click)="clicked.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="inner" />
      </a>
    } @else {
      <button
        [type]="type()"
        [attr.aria-label]="ariaLabel() ?? null"
        [disabled]="disabled() || loading()"
        [attr.data-jbutton-icon-position]="iconPosition()"
        [attr.data-jbutton-full-width]="fullWidth() ? 'true' : null"
        [style]="style()"
        [class]="classes()"
        (click)="clicked.emit($event)"
        (focus)="focused.emit($event)"
        (blur)="blurred.emit($event)"
        (keydown)="keydown.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="inner" />
      </button>
    }

    <ng-template #inner>
      <span class="jbutton-icon inline-flex" [attr.aria-hidden]="loading() ? null : true">
        @if (loading()) {
          <j-spinner size="sm" />
        } @else {
          <ng-content select="[jIcon]" />
        }
      </span>
      <span class="jbutton-text">
        <ng-content />
      </span>
    </ng-template>
  `;

export const J_BUTTON_STYLES = [
    `
      .jbutton-icon:empty {
        display: none;
      }
      .jbutton-text:empty {
        display: none;
      }
    `,
  ];
