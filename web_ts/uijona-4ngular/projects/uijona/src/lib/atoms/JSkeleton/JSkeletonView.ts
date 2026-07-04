// JSkeletonView.ts — JONA View (template puro)
export const J_SKELETON_TEMPLATE = `
    <div
      aria-hidden="true"
      [attr.data-jskeleton-variant]="variant()"
      [attr.data-jskeleton-circle]="circle() ? true : null"
      [style]="style()"
      [class]="classes()"
    ></div>
  `;
