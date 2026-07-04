import { J_FILE_UPLOAD_TEMPLATE } from './JFileUploadView';
import type { JFileUploadReject, InterJFileUpload } from './InterJFileUpload';
import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { cn } from '../../core/cn';

function acceptsFile(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept.split(',').map((r) => r.trim()).filter(Boolean);
  if (rules.length === 0) return true;
  return rules.some((rule) => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

let uid = 0;

/**
 * JFileUpload — dropzone/input de archivos con arrastrar-soltar, validación de
 * `accept`/`maxFiles` y lista de seleccionados.
 */
@Component({
  selector: 'j-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_FILE_UPLOAD_TEMPLATE,
})
export class JFileUpload {
  readonly files = model<File[]>([]);
  readonly label = input<string>('Upload files');
  readonly description = input<string>('Drag files here or choose from your device.');
  readonly helperText = input<string>();
  readonly maxFiles = input<number>();
  readonly accept = input<string>();
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>('');
  readonly dropzoneClassName = input<string>('');
  readonly fileListClassName = input<string>('');

  readonly rejected = output<JFileUploadReject>();
  readonly fileRemoved = output<{ file: File; nextFiles: File[] }>();

  protected readonly cn = cn;
  protected readonly formatBytes = formatBytes;
  protected readonly inputId = `jona-file-upload-${uid++}`;
  private readonly dragging = signal(false);

  protected readonly dropzoneClasses = computed(() =>
    cn(
      'flex min-h-36 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white px-4 py-6 text-center transition-colors',
      this.dragging()
        ? 'border-primary-500 bg-primary-50'
        : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50',
      this.disabled() && 'pointer-events-none opacity-50',
      this.dropzoneClassName()
    )
  );

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.commit(Array.from(target.files ?? []));
    target.value = '';
  }
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }
  protected onDragLeave(): void {
    this.dragging.set(false);
  }
  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.commit(Array.from(event.dataTransfer?.files ?? []));
  }

  private commit(incoming: File[]): void {
    const accept = this.accept();
    const accepted = incoming.filter((f) => acceptsFile(f, accept));
    const rejectedByAccept = incoming.filter((f) => !acceptsFile(f, accept));
    if (rejectedByAccept.length > 0) this.rejected.emit({ reason: 'accept', files: rejectedByAccept });

    const merged = this.multiple() ? [...this.files(), ...accepted] : accepted.slice(0, 1);
    const max = this.maxFiles();
    const limited = max ? merged.slice(0, max) : merged;
    if (max && merged.length > max) this.rejected.emit({ reason: 'max-files', files: merged.slice(max) });
    this.files.set(limited);
  }

  protected removeFile(file: File): void {
    const nextFiles = this.files().filter((f) => f !== file);
    this.files.set(nextFiles);
    this.fileRemoved.emit({ file, nextFiles });
  }
}
