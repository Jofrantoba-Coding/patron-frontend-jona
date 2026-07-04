// JHomeCreateAccountView.ts — JONA View (template puro)
export const J_HOME_CREATE_ACCOUNT_TEMPLATE = `
    <j-border-layout>
      <j-header-page jNorth [title]="appTitle()" />
      <j-footer-page jSouth [text]="footerText()" />
      <j-create-account
        [(name)]="name"
        [(email)]="email"
        [(password)]="password"
        [(confirmPassword)]="confirmPassword"
        [nameError]="nameError()"
        [emailError]="emailError()"
        [passwordError]="passwordError()"
        [confirmPasswordError]="confirmPasswordError()"
        [alertMessage]="alertMessage()"
        [isLoading]="isLoading()"
        (submitted)="submitted.emit($event)"
        (goToLogin)="goToLogin.emit()"
      />
    </j-border-layout>
  `;

