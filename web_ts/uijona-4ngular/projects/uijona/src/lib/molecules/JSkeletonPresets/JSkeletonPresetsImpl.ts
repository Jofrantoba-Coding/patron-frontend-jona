import { J_SKELETON_PRESETS_TEMPLATE_1, J_SKELETON_PRESETS_TEMPLATE_2, J_SKELETON_PRESETS_TEMPLATE_3, J_SKELETON_PRESETS_TEMPLATE_4 } from './JSkeletonPresetsView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { JSkeleton } from '../../atoms/JSkeleton';

/** Fila de usuario (avatar + dos líneas). */
@Component({
  selector: 'j-skeleton-user-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSkeleton],
  host: { class: 'contents' },
  template: J_SKELETON_PRESETS_TEMPLATE_1,
})
export class JSkeletonUserRow {}

/** Tarjeta con título, texto y acciones. */
@Component({
  selector: 'j-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSkeleton],
  host: { class: 'contents' },
  template: J_SKELETON_PRESETS_TEMPLATE_2,
})
export class JSkeletonCard {}

/** Filas de tabla. */
@Component({
  selector: 'j-skeleton-table-rows',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSkeleton],
  host: { class: 'contents' },
  template: J_SKELETON_PRESETS_TEMPLATE_3,
})
export class JSkeletonTableRows {
  readonly rows = input<number>(4);
  readonly cols = input<number>(4);
  protected readonly rowsArr = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
  protected readonly colsArr = computed(() => Array.from({ length: this.cols() }, (_, i) => i));
}

/** Campos de formulario. */
@Component({
  selector: 'j-skeleton-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSkeleton],
  host: { class: 'contents' },
  template: J_SKELETON_PRESETS_TEMPLATE_4,
})
export class JSkeletonForm {
  readonly fields = input<number>(3);
  protected readonly fieldsArr = computed(() => Array.from({ length: this.fields() }, (_, i) => i));
}
