// JHomeLoginView.ts — JONA View (template puro)
export const J_HOME_LOGIN_TEMPLATE = `
    <j-border-layout>
      <j-header-page jNorth [title]="appTitle()" />
      <j-footer-page jSouth [text]="footerText()" />
      <j-login
        [(email)]="email"
        [(password)]="password"
        [emailError]="emailError()"
        [passwordError]="passwordError()"
        [alertMessage]="alertMessage()"
        [isLoading]="isLoading()"
        (submitted)="submitted.emit($event)"
        (goToCreateAccount)="goToCreateAccount.emit()"
        (goToRecoverPassword)="goToRecoverPassword.emit()"
      />
    </j-border-layout>
  `;

