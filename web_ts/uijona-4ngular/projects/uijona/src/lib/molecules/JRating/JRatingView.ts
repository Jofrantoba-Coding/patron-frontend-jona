// JRatingView.ts — JONA View (template puro)
export const J_RATING_TEMPLATE = `
    <span
      [attr.role]="readOnly() ? 'img' : 'group'"
      [attr.aria-label]="
        readOnly() ? 'Calificación: ' + value() + ' de ' + max() : 'Selecciona calificación de ' + max()
      "
      [class]="cn('inline-flex items-center gap-0.5', className())"
    >
      @for (star of stars(); track star) {
        <button
          type="button"
          [attr.aria-label]="star + (star !== 1 ? ' estrellas' : ' estrella')"
          [attr.aria-pressed]="star === value()"
          [disabled]="readOnly()"
          [class]="buttonClasses()"
          (click)="onStarClick(star)"
          (mouseenter)="onStarEnter(star)"
          (mouseleave)="onStarLeave()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" [class]="starClasses(star)">
            <path
              stroke-width="1.5"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      }
    </span>
  `;

