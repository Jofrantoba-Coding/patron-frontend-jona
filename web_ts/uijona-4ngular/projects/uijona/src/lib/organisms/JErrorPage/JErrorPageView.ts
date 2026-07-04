// JErrorPageView.ts — JONA View (template puro)
export const J_ERROR_PAGE_TEMPLATE = `
    <div class="flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
      <div class="flex w-full max-w-sm flex-col items-center sm:max-w-md">
        @if (errorCode() !== undefined && errorCode() !== null && errorCode() !== '') {
          <p class="mb-4 select-none text-8xl font-extrabold leading-none text-primary-600">{{ errorCode() }}</p>
        }
        <h1 class="mb-2 text-2xl font-bold text-neutral-900">{{ title() }}</h1>
        <p class="mb-8 break-words text-base text-neutral-500">{{ message() }}</p>
        <div class="flex flex-wrap justify-center gap-3">
          <j-button variant="link" (clicked)="goHome.emit()">{{ primaryLabel() }}</j-button>
          <j-button variant="outline" (clicked)="goBack.emit()">{{ secondaryLabel() }}</j-button>
        </div>
      </div>
    </div>
  `;

