import { J_STEPPER_TEMPLATE } from './JStepperView';
import type { JStepperOrientation, JStepperStepStatus, JStepperStep, InterJStepper } from './InterJStepper';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JStepper — indicador de progreso por pasos (horizontal o vertical).
 */
@Component({
  selector: 'j-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'contents' },
  template: J_STEPPER_TEMPLATE,
})
export class JStepper {
  readonly steps = input.required<JStepperStep[]>();
  readonly currentStep = model<number>(0);
  readonly orientation = input<JStepperOrientation>('horizontal');
  readonly allowStepClick = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly cn = cn;

  protected readonly listClasses = computed(() =>
    cn(
      this.orientation() === 'vertical'
        ? 'flex min-w-0 flex-col gap-4'
        : 'flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start',
      this.className()
    )
  );

  protected status(index: number): JStepperStepStatus {
    const active = this.currentStep();
    if (index < active) return 'complete';
    if (index === active) return 'current';
    return 'upcoming';
  }

  protected itemClasses(step: JStepperStep): string {
    return cn(
      'relative flex min-w-0 gap-3',
      this.orientation() === 'horizontal' && 'sm:flex-1',
      step.disabled && 'opacity-60'
    );
  }

  protected indicatorClasses(index: number, step: JStepperStep): string {
    const status = this.status(index);
    return cn(
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
      status === 'complete' && 'border-primary-600 bg-primary-600 text-white',
      status === 'current' && 'border-primary-600 bg-white text-primary-700',
      status === 'upcoming' && 'border-neutral-300 bg-white text-neutral-500',
      step.disabled && 'opacity-50'
    );
  }

  readonly stepChange = output<{ index: number; step: JStepperStep }>();

  protected onStepClick(index: number, step: JStepperStep): void {
    this.currentStep.set(index);
    this.stepChange.emit({ index, step });
  }
}
