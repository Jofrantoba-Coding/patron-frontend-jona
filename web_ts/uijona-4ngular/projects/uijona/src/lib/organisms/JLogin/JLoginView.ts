// JLoginView.ts — JONA View (template puro)
export const J_LOGIN_TEMPLATE = `
    <j-card className="w-full max-w-sm mx-auto">
      <j-card-header>
        <j-card-title>Sign in</j-card-title>
        <j-card-description>Enter your credentials to access your account</j-card-description>
      </j-card-header>
      <j-card-content>
        @if (alertMessage()) {
          <j-alert variant="danger" title="Error" className="mb-4">{{ alertMessage() }}</j-alert>
        }
        <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
          <j-form-field id="txtEmail" label="Email" type="email" [(value)]="email" placeholder="you@example.com" [errorMessage]="emailError()" [required]="true" />
          <j-form-field id="txtPassword" label="Password" type="password" [(value)]="password" placeholder="••••••••" [errorMessage]="passwordError()" [required]="true" />
          <j-button type="submit" [fullWidth]="true" [loading]="isLoading()">Sign in</j-button>
        </form>
      </j-card-content>
      <j-card-footer className="flex-col gap-2">
        <j-button variant="ghost" [fullWidth]="true" (clicked)="goToCreateAccount.emit()">Create account</j-button>
        <j-button variant="link" [fullWidth]="true" (clicked)="goToRecoverPassword.emit()">Forgot password?</j-button>
      </j-card-footer>
    </j-card>
  `;

