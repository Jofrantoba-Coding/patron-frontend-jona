import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JPanel, type JPanelLayout } from '../../atoms/JPanel';
import { JLayoutBase, LAYOUT_TEMPLATE } from '../LayoutBase';

/** JCardLayout — muestra una sola tarjeta hija (layout=card). */
@Component({
  selector: 'j-card-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: LAYOUT_TEMPLATE,
})
export class JCardLayout extends JLayoutBase {
  readonly layoutType: JPanelLayout = 'card';
}
