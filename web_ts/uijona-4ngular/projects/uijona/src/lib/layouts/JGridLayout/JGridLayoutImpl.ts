import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase } from '../LayoutBase';

/** JGridLayout — grilla auto-fit responsive (layout=grid). */
@Component({
  selector: 'j-grid-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  templateUrl: '../LayoutBaseView.html',
})
export class JGridLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'grid';
  protected override defaultGap = 'md' as const;
  protected override defaultAutoFitMin = '12rem';
  protected override defaultPlacement = 'responsive' as const;
}
