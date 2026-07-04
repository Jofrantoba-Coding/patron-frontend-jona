// JHomeErrorView.ts — JONA View (template puro)
export const J_HOME_ERROR_TEMPLATE = `
    <j-border-layout>
      <j-header-page jNorth [title]="appTitle()" />
      <j-footer-page jSouth [text]="footerText()" />
      <j-error-page
        [errorCode]="errorCode()"
        [title]="title()"
        [message]="message()"
        [primaryLabel]="primaryLabel()"
        [secondaryLabel]="secondaryLabel()"
        (goHome)="goHome.emit()"
        (goBack)="goBack.emit()"
      />
    </j-border-layout>
  `;

