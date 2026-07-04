// JAvatarView.ts — JONA View (template puro)
export const J_AVATAR_TEMPLATE = `
    <div
      [class]="classes()"
      [style]="style()"
      [attr.data-javatar-size]="size()"
      [attr.data-javatar-shape]="shape()"
      [attr.data-javatar-has-image]="showImage() ? 'true' : null"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() ?? null"
    >
      @if (showImage()) {
        <img [src]="src()" [alt]="alt()" (error)="onError()" />
      } @else {
        <span aria-hidden="true">{{ initials() ?? '?' }}</span>
      }
    </div>
  `;
