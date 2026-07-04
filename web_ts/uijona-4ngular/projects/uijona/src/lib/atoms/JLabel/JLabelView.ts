// JLabelView.ts — JONA View (template puro)
export const J_LABEL_TEMPLATE = `
    <ng-template #body>
      <ng-content />{{ message() }}
      @if (showRequired()) {
        <span class="ml-0.5 text-danger-500" aria-hidden="true">*</span>
      }
    </ng-template>

    @switch (resolvedAs()) {
      @case ('a') {
        <a
          [attr.href]="disabled() ? null : href()"
          [attr.target]="target() ?? null"
          [attr.rel]="resolvedRel()"
          [attr.aria-disabled]="disabled() ? true : null"
          [attr.tabindex]="disabled() ? -1 : null"
          [attr.data-jlabel-variant]="variant()"
          [style]="style()"
          [class]="classes()"
          (click)="onLinkClick($event)"
        >
          <ng-container [ngTemplateOutlet]="body" />
        </a>
      }
      @case ('label') {
        <label
          [attr.for]="htmlFor() ?? null"
          [attr.data-jlabel-variant]="variant()"
          [style]="style()"
          [class]="classes()"
        >
          <ng-container [ngTemplateOutlet]="body" />
        </label>
      }
      @case ('h1') {
        <h1 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h1>
      }
      @case ('h2') {
        <h2 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h2>
      }
      @case ('h3') {
        <h3 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h3>
      }
      @case ('h4') {
        <h4 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h4>
      }
      @case ('h5') {
        <h5 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h5>
      }
      @case ('h6') {
        <h6 [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </h6>
      }
      @case ('span') {
        <span [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </span>
      }
      @case ('div') {
        <div [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </div>
      }
      @case ('strong') {
        <strong [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </strong>
      }
      @case ('em') {
        <em [attr.data-jlabel-variant]="variant()" [style]="style()" [class]="classes()">
          <ng-container [ngTemplateOutlet]="body" />
        </em>
      }
      @default {
        <p
          [attr.role]="variant() === 'error' ? 'alert' : null"
          [attr.data-jlabel-variant]="variant()"
          [style]="style()"
          [class]="classes()"
        >
          <ng-container [ngTemplateOutlet]="body" />
        </p>
      }
    }
  `;
