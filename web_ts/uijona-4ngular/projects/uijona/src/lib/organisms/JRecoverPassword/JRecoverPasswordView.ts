// JRecoverPasswordView.ts — JONA View (template puro)
export const J_RECOVER_PASSWORD_TEMPLATE = `
    <j-card className="w-full max-w-sm mx-auto">
      <j-card-header>
        <j-card-title>Recover password</j-card-title>
        <j-card-description>Enter your email and we'll send you a reset link</j-card-description>
      </j-card-header>
      <j-card-content>
        @if (alertMessage()) {
          <j-alert variant="danger" title="Error" className="mb-4">{{ alertMessage() }}</j-alert>
        }
        @if (successMessage()) {
          <j-alert variant="success" title="Email sent" className="mb-4">{{ successMessage() }}</j-alert>
        }
        <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
          <j-form-field id="txtRecoverEmail" label="Email" type="email" [(value)]="email" placeholder="you@example.com" [errorMessage]="emailError()" [required]="true" />
          <j-button type="submit" [fullWidth]="true" [loading]="isLoading()">Send reset link</j-button>
        </form>
      </j-card-content>
      <j-card-footer>
        <j-button variant="ghost" [fullWidth]="true" (clicked)="goToLogin.emit()">Back to sign in</j-button>
      </j-card-footer>
    </j-card>
  `;

