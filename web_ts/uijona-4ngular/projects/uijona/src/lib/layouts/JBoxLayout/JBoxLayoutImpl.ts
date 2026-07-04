import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase, LAYOUT_TEMPLATE } from '../LayoutBase';

/** JBoxLayout — stack o fila flexible (layout=box). */
@Component({
  selector: 'j-box-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: LAYOUT_TEMPLATE,
})
export class JBoxLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'box';
  protected override defaultGap = 'md' as const;
  protected override defaultDirection = 'column' as const;
  protected override defaultWrap = 'nowrap' as const;
}
