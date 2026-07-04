// JBorderLayoutView.ts — JONA View (template puro)
export const J_BORDER_LAYOUT_TEMPLATE = `
    <j-panel layout="border" [className]="cn('bg-neutral-50', className())" [style]="style()">
      @if (hasNorth()) {
        <header data-panel-area="top" [class]="northClassName()"><ng-content select="[jNorth]" /></header>
      }
      @if (hasWest()) {
        <aside data-panel-area="left" [class]="westClassName()"><ng-content select="[jWest]" /></aside>
      }
      <main data-panel-area="center" [class]="cn('overflow-auto', centerClassName())">
        <ng-content />
      </main>
      @if (hasEast()) {
        <aside data-panel-area="right" [class]="eastClassName()"><ng-content select="[jEast]" /></aside>
      }
      @if (hasSouth()) {
        <footer data-panel-area="bottom" [class]="southClassName()"><ng-content select="[jSouth]" /></footer>
      }
    </j-panel>
  `;
