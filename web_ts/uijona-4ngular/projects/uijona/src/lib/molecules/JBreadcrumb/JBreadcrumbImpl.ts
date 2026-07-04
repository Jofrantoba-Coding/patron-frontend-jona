import { J_BREADCRUMB_TEMPLATE_1, J_BREADCRUMB_TEMPLATE_2, J_BREADCRUMB_TEMPLATE_3, J_BREADCRUMB_TEMPLATE_4, J_BREADCRUMB_TEMPLATE_5, J_BREADCRUMB_TEMPLATE_6, J_BREADCRUMB_TEMPLATE_7 } from './JBreadcrumbView';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';

/**
 * JBreadcrumb — navegación jerárquica. Se compone con JBreadcrumbList /
 * JBreadcrumbItem / JBreadcrumbLink / JBreadcrumbPage / JBreadcrumbSeparator /
 * JBreadcrumbEllipsis.
 */
@Component({
  selector: 'j-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_1,
})
export class JBreadcrumb {
  readonly className = input<string>('');
  protected readonly cn = cn;
}

@Component({
  selector: 'j-breadcrumb-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_2,
})
export class JBreadcrumbList {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex flex-wrap items-center gap-1.5 text-sm text-neutral-500', this.className())
  );
}

@Component({
  selector: 'j-breadcrumb-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_3,
})
export class JBreadcrumbItem {
  readonly className = input<string>('');
  protected readonly cn = cn;
}

@Component({
  selector: 'j-breadcrumb-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_4,
})
export class JBreadcrumbLink {
  readonly href = input<string>();
  readonly className = input<string>('');
  readonly navigate = output<void>();
  protected readonly cn = cn;
  protected onClick(event: MouseEvent): void {
    // Sin href real (href='#') es un enlace de navegación SPA: evita el salto.
    if (!this.href()) event.preventDefault();
    this.navigate.emit();
  }
}

@Component({
  selector: 'j-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_5,
})
export class JBreadcrumbPage {
  readonly className = input<string>('');
  protected readonly cn = cn;
}

@Component({
  selector: 'j-breadcrumb-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_6,
})
export class JBreadcrumbSeparator {
  readonly className = input<string>('');
  protected readonly cn = cn;
}

@Component({
  selector: 'j-breadcrumb-ellipsis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_BREADCRUMB_TEMPLATE_7,
})
export class JBreadcrumbEllipsis {
  readonly className = input<string>('');
  protected readonly cn = cn;
}
