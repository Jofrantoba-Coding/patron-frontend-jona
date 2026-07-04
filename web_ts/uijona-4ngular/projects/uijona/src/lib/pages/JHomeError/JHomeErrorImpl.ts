import { J_HOME_ERROR_TEMPLATE } from './JHomeErrorView';
import type { InterJHomeError } from './InterJHomeError';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { JBorderLayout, JNorth, JSouth } from '../../layouts';
import { JErrorPage, JFooterPage, JHeaderPage } from '../../organisms';
/** JHomeError — página completa de error con header, footer y JErrorPage. */
@Component({
  selector: 'j-home-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JBorderLayout, JNorth, JSouth, JHeaderPage, JFooterPage, JErrorPage],
  host: { class: 'contents' },
  template: J_HOME_ERROR_TEMPLATE,
})
export class JHomeError {
  readonly errorCode = input<string | number>('404');
  readonly title = input<string>('Page not found');
  readonly message = input<string>("The page you're looking for doesn't exist or has been moved.");
  readonly primaryLabel = input<string>('Go home');
  readonly secondaryLabel = input<string>('Go back');
  readonly appTitle = input<string>('JONA UI');
  readonly footerText = input<string>('© 2026 JONA UI');

  readonly goHome = output<void>();
  readonly goBack = output<void>();
}
