import { J_ERROR_PAGE_TEMPLATE } from './JErrorPageView';
import type { InterJErrorPage } from './InterJErrorPage';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { JButton } from '../../atoms/JButton';
/** JErrorPage — página de error (404, etc.) con acciones. */
@Component({
  selector: 'j-error-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton],
  host: { class: 'contents' },
  template: J_ERROR_PAGE_TEMPLATE,
})
export class JErrorPage {
  readonly errorCode = input<string | number>('404');
  readonly title = input<string>('Page not found');
  readonly message = input<string>("The page you're looking for doesn't exist or has been moved.");
  readonly primaryLabel = input<string>('Go home');
  readonly secondaryLabel = input<string>('Go back');

  readonly goHome = output<void>();
  readonly goBack = output<void>();
}
