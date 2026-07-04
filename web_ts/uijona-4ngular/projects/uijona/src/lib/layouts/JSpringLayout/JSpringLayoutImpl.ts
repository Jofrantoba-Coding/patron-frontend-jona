import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase, LAYOUT_TEMPLATE } from '../LayoutBase';

/** JSpringLayout — grilla en móvil, constraints absolutas en breakpoints (layout=spring). */
@Component({
  selector: 'j-spring-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: LAYOUT_TEMPLATE,
})
export class JSpringLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'spring';
  protected override defaultGap = 'md' as const;
  protected override defaultAutoFitMin = '12rem';
  protected override defaultPlacement = 'responsive' as const;
}
