// JFileUploadView.ts — JONA View (template puro)
export const J_FILE_UPLOAD_TEMPLATE = `
    <div [class]="cn('flex w-full min-w-0 flex-col gap-3', className())">
      <label
        [for]="inputId"
        [class]="dropzoneClasses()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave()"
        (drop)="onDrop($event)"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" /><path d="M12 3v12" />
          </svg>
        </span>
        <span class="break-words text-sm font-medium text-neutral-900">{{ label() }}</span>
        @if (description(); as d) {
          <span class="max-w-sm break-words text-sm text-neutral-500">{{ d }}</span>
        }
        @if (maxFiles(); as m) {
          <span class="text-xs text-neutral-400">Max {{ m }} file{{ m === 1 ? '' : 's' }}</span>
        }
        <input
          [id]="inputId"
          type="file"
          [attr.accept]="accept() ?? null"
          [multiple]="multiple()"
          [disabled]="disabled()"
          [attr.aria-label]="label()"
          class="sr-only"
          (change)="onInputChange($event)"
        />
      </label>

      @if (helperText(); as h) {
        <p class="break-words text-xs text-neutral-500">{{ h }}</p>
      }

      @if (files().length > 0) {
        <ul [class]="cn('flex min-w-0 flex-col gap-2', fileListClassName())">
          @for (file of files(); track file.name + '-' + file.size + '-' + file.lastModified) {
            <li class="flex min-w-0 items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-neutral-900">{{ file.name }}</p>
                <p class="text-xs text-neutral-500">{{ formatBytes(file.size) }}</p>
              </div>
              <button
                type="button"
                (click)="removeFile(file)"
                class="shrink-0 rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Remove
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `;

