// JHomeRecoverPasswordView.ts — JONA View (template puro)
export const J_HOME_RECOVER_PASSWORD_TEMPLATE = `
    <j-border-layout>
      <j-header-page jNorth [title]="appTitle()" />
      <j-footer-page jSouth [text]="footerText()" />
      <j-recover-password
        [(email)]="email"
        [emailError]="emailError()"
        [alertMessage]="alertMessage()"
        [successMessage]="successMessage()"
        [isLoading]="isLoading()"
        (submitted)="submitted.emit($event)"
        (goToLogin)="goToLogin.emit()"
      />
    </j-border-layout>
  `;

