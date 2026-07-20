import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * BFF: envía la cookie de sesión del gateway en toda llamada al gateway
 * (`withCredentials`). No toca las llamadas al mock ni a otros orígenes.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith(environment.gatewayBaseUrl)
    ? next(req.clone({ withCredentials: true }))
    : next(req);
