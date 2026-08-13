import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase } from '../LayoutBase';

/** JFlowLayout — fila flexible con wrap (layout=flow). */
@Component({
  selector: 'j-flow-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  templateUrl: '../LayoutBaseView.html',
})
export class JFlowLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'flow';
  protected override defaultGap = 'md' as const;
  protected override defaultDirection = 'row' as const;
  protected override defaultWrap = 'wrap' as const;
}
