import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase } from '../LayoutBase';

/** JBoxLayout — stack o fila flexible (layout=box). */
@Component({
  selector: 'j-box-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  templateUrl: '../LayoutBaseView.html',
})
export class JBoxLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'box';
  protected override defaultGap = 'md' as const;
  protected override defaultDirection = 'column' as const;
  protected override defaultWrap = 'nowrap' as const;
}
