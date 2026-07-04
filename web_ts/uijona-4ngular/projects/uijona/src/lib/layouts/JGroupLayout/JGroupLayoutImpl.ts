import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase, LAYOUT_TEMPLATE } from '../LayoutBase';

/** JGroupLayout — grupos en grilla responsive con spans (layout=group). */
@Component({
  selector: 'j-group-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: LAYOUT_TEMPLATE,
})
export class JGroupLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'group';
  protected override defaultGap = 'md' as const;
  protected override defaultAutoFitMin = '12rem';
  protected override defaultPlacement = 'responsive' as const;
}
