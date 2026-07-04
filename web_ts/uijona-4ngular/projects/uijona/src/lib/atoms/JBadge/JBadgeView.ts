// JBadgeView.ts — JONA View (template puro)
export const J_BADGE_TEMPLATE = `
    <span [attr.data-jbadge-variant]="variant()" [style]="style()" [class]="classes()">
      <ng-content />
    </span>
  `;
