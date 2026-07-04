// JAlertView.ts — JONA View (template puro)
export const J_ALERT_TEMPLATE = `
    <div role="alert" [class]="classes()" [style]="style()">
      <span class="absolute left-4 top-4 text-current jalert-icon" aria-hidden="true">
        <ng-content select="[jIcon]" />
      </span>

      @if (dismissible()) {
        <button
          type="button"
          aria-label="Cerrar alerta"
          [class]="dismissClasses()"
          (click)="dismissed.emit()"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }

      @if (title(); as t) {
        <h5 class="mb-1 break-words font-medium leading-tight tracking-tight">{{ t }}</h5>
      }

      <div class="break-words text-sm [&_p]:leading-relaxed">
        <ng-content />
      </div>
    </div>
  `;

export const J_ALERT_STYLES = [`.jalert-icon:empty { display: none; }`];

