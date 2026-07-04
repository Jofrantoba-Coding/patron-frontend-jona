// JPanelView.ts — JONA View (template puro)
export const J_PANEL_TEMPLATE = `
    <div
      [class]="classes()"
      [style]="layoutStyle()"
      [attr.data-jpanel-layout]="ms().layout"
      [attr.data-jpanel-mobile-small-layout]="ms().layout"
      [attr.data-jpanel-mobile-large-layout]="ml().layout"
      [attr.data-jpanel-tablet-layout]="tb().layout"
      [attr.data-jpanel-desktop-layout]="dk().layout"
      [attr.data-jpanel-tv-layout]="tv2().layout"
      [attr.data-jpanel-placement]="placementOf(ms())"
      [attr.data-jpanel-mobile-small-placement]="placementOf(ms())"
      [attr.data-jpanel-mobile-large-placement]="placementOf(ml())"
      [attr.data-jpanel-tablet-placement]="placementOf(tb())"
      [attr.data-jpanel-desktop-placement]="placementOf(dk())"
      [attr.data-jpanel-tv-placement]="placementOf(tv2())"
      [attr.data-jpanel-dense]="ms().dense ? 'true' : 'false'"
      [attr.data-jpanel-mobile-small-dense]="ms().dense ? 'true' : 'false'"
      [attr.data-jpanel-mobile-large-dense]="ml().dense ? 'true' : 'false'"
      [attr.data-jpanel-tablet-dense]="tb().dense ? 'true' : 'false'"
      [attr.data-jpanel-desktop-dense]="dk().dense ? 'true' : 'false'"
      [attr.data-jpanel-tv-dense]="tv2().dense ? 'true' : 'false'"
      [attr.data-jpanel-mode]="ms().mode ?? 'sequential'"
      [attr.data-jpanel-mobile-small-mode]="ms().mode ?? 'sequential'"
      [attr.data-jpanel-mobile-large-mode]="ml().mode ?? 'sequential'"
      [attr.data-jpanel-tablet-mode]="tb().mode ?? 'sequential'"
      [attr.data-jpanel-desktop-mode]="dk().mode ?? 'sequential'"
      [attr.data-jpanel-tv-mode]="tv2().mode ?? 'sequential'"
    >
      <ng-content />
    </div>
  `;
