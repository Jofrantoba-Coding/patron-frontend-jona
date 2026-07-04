// JIconView.ts — JONA View (template puro)
export const J_ICON_TEMPLATE = `
    <j-button
      size="icon"
      [type]="type()"
      [variant]="variant()"
      [loading]="loading()"
      [disabled]="disabled()"
      [ariaLabel]="label()"
      [iconOnly]="true"
      [className]="className()"
      [style]="style()"
      (clicked)="clicked.emit($event)"
      (focused)="focused.emit($event)"
      (blurred)="blurred.emit($event)"
    >
      <span jIcon><ng-content /></span>
    </j-button>
  `;
