import { DOCUMENT, Injectable, inject } from '@angular/core';
import { JONA_TOKEN_MAP, type JonaThemeTokens } from './inter-theme';

/**
 * JonaThemeService
 *
 * Equivalente Angular de `JonaThemeProvider` (React). Inyecta variables CSS del
 * design system JONA en un scope (por defecto `:root`) para sobreescribir tokens
 * en tiempo de ejecucion.
 *
 *   const theme = inject(JonaThemeService);
 *   theme.apply({ primary600: '124 58 237', radius: '0.5rem' });
 *   // ...
 *   theme.reset();
 *
 * Importa la hoja de tokens una sola vez en tu app:
 *   @import 'uijona-4ngular/styles/tokens.css';
 */
@Injectable({ providedIn: 'root' })
export class JonaThemeService {
  private readonly document = inject(DOCUMENT);
  private applied = new Map<string, string[]>();

  /** Aplica los tokens indicados al scope (selector CSS, por defecto `:root`). */
  apply(theme: JonaThemeTokens, scope = ':root'): void {
    const target = this.resolveTarget(scope);
    if (!target) return;

    const vars: string[] = [];
    (Object.entries(theme) as [keyof JonaThemeTokens, string | undefined][]).forEach(
      ([key, value]) => {
        const cssVar = JONA_TOKEN_MAP[key];
        if (cssVar && value !== undefined) {
          target.style.setProperty(cssVar, value);
          vars.push(cssVar);
        }
      }
    );
    this.applied.set(scope, [...(this.applied.get(scope) ?? []), ...vars]);
  }

  /** Elimina los tokens aplicados previamente en el scope. */
  reset(scope = ':root'): void {
    const target = this.resolveTarget(scope);
    const vars = this.applied.get(scope);
    if (!target || !vars) return;
    vars.forEach((cssVar) => target.style.removeProperty(cssVar));
    this.applied.delete(scope);
  }

  private resolveTarget(scope: string): HTMLElement | null {
    if (scope === ':root') {
      return this.document.documentElement;
    }
    return (
      (this.document.querySelector(scope) as HTMLElement | null) ??
      this.document.documentElement
    );
  }
}
