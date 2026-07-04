// JDotView.ts — JONA View (template puro)
export const J_DOT_TEMPLATE = `
    @if (pulse()) {
      <span
        [class]="cn('jdot relative inline-flex', sizeClass(), className())"
        [style]="style()"
        [attr.role]="ariaLabel() ? 'status' : null"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-hidden]="ariaLabel() ? null : true"
      >
        <span
          [class]="
            cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', toneClass())
          "
          aria-hidden="true"
        ></span>
        <span
          [class]="cn('relative inline-flex rounded-full', sizeClass(), toneClass())"
          aria-hidden="true"
        ></span>
      </span>
    } @else {
      <span
        [class]="cn('jdot inline-block shrink-0 rounded-full', sizeClass(), toneClass(), className())"
        [style]="style()"
        [attr.role]="ariaLabel() ? 'status' : null"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-hidden]="ariaLabel() ? null : true"
      ></span>
    }
  `;
