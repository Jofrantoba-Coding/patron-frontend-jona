// border-layout.component.ts — Layout reutilizable (accesible desde la capa Template)
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-border-layout',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="border-layout">
      <div class="border-layout-north" *ngIf="north">
        <ng-container *ngIf="north">
          <ng-content select="[slot=north]" />
        </ng-container>
      </div>
      <div class="border-layout-middle">
        <div class="border-layout-west" *ngIf="west">
          <ng-content select="[slot=west]" />
        </div>
        <div class="border-layout-center">
          <ng-content select="[slot=center]" />
        </div>
        <div class="border-layout-east" *ngIf="east">
          <ng-content select="[slot=east]" />
        </div>
      </div>
      <div class="border-layout-south" *ngIf="south">
        <ng-content select="[slot=south]" />
      </div>
    </div>
  `,
})
export class BorderLayoutComponent {
  @Input() north = true;
  @Input() south = true;
  @Input() east = false;
  @Input() west = false;
}
