// JCreateAccountView.ts — JONA View (template puro)
export const J_CREATE_ACCOUNT_TEMPLATE = `
    <j-card className="w-full max-w-sm mx-auto">
      <j-card-header>
        <j-card-title>Create account</j-card-title>
        <j-card-description>Fill in your details to get started</j-card-description>
      </j-card-header>
      <j-card-content>
        @if (alertMessage()) {
          <j-alert variant="danger" title="Error" className="mb-4">{{ alertMessage() }}</j-alert>
        }
        <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
          <j-form-field id="txtName" label="Full name" type="text" [(value)]="name" placeholder="John Doe" [errorMessage]="nameError()" [required]="true" />
          <j-form-field id="txtCreateEmail" label="Email" type="email" [(value)]="email" placeholder="you@example.com" [errorMessage]="emailError()" [required]="true" />
          <j-form-field id="txtCreatePassword" label="Password" type="password" [(value)]="password" placeholder="••••••••" [errorMessage]="passwordError()" [required]="true" />
          <j-form-field id="txtConfirmPassword" label="Confirm password" type="password" [(value)]="confirmPassword" placeholder="••••••••" [errorMessage]="confirmPasswordError()" [required]="true" />
          <j-button type="submit" [fullWidth]="true" [loading]="isLoading()">Create account</j-button>
        </form>
      </j-card-content>
      <j-card-footer>
        <j-button variant="ghost" [fullWidth]="true" (clicked)="goToLogin.emit()">Already have an account? Sign in</j-button>
      </j-card-footer>
    </j-card>
  `;

