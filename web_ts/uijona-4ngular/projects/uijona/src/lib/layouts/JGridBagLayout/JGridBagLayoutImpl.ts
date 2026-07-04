import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase, LAYOUT_TEMPLATE } from '../LayoutBase';

/** JGridBagLayout — grilla responsive con constraints por hijo (layout=gridbag). */
@Component({
  selector: 'j-grid-bag-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: LAYOUT_TEMPLATE,
})
export class JGridBagLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'gridbag';
  protected override defaultGap = 'md' as const;
  protected override defaultAutoFitMin = '12rem';
  protected override defaultPlacement = 'responsive' as const;
}
