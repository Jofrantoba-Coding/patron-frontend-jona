import { InjectionToken } from '@angular/core';
import type { InterAuthService } from './InterAuthService';

export const AUTH_SERVICE = new InjectionToken<InterAuthService>('AUTH_SERVICE');
