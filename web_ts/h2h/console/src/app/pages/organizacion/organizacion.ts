import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JDataTable, JDialog, JPagination, JSectionHeading, JTabs, JTabsContent, JTabsList, JTabsTrigger } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { OrganizacionViewComponent } from './organizacion-view.component';

@Component({
  selector: 'app-organizacion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent, JBadge],
  templateUrl: './organizacion-view.component.html',
})
export class OrganizacionPage extends OrganizacionViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  override load(): void {
    this.loading.set(true);
    this.api
      .organizacionDetalle()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => this.setDetalle(res));
  }
}
