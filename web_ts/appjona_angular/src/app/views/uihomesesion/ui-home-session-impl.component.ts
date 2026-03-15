// ui-home-session-impl.component.ts
// Capa: Implementation — solo métodos, sin HTML
// Responsabilidad: leer usuario de localStorage, implementar logout real con Router
// Restricciones: sin template propio — reutiliza el templateUrl del Template
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BorderLayoutComponent } from '../../uilayouts/border-layout.component';
import { HeaderComponent } from '../../uiutils/header.component';
import { FooterComponent } from '../../uiutils/footer.component';
import { UiHomeSessionComponent } from './ui-home-session.component';

@Component({
  selector: 'app-ui-home-session-impl',
  standalone: true,
  imports: [BorderLayoutComponent, HeaderComponent, FooterComponent],
  // Reutiliza el template del componente base — sin duplicar HTML
  templateUrl: './ui-home-session.component.html',
})
export class UiHomeSessionImplComponent extends UiHomeSessionComponent implements OnInit {
  private router = inject(Router);

  override ngOnInit(): void {
    const userRaw = localStorage.getItem('jona_user');
    const user = userRaw ? JSON.parse(userRaw) : { name: '', email: '' };
    this.name = (user.nombre ?? user.name) as string;
    this.email = user.email as string;
  }

  override logout(): void {
    localStorage.removeItem('jona_authenticated');
    localStorage.removeItem('jona_token');
    localStorage.removeItem('jona_user');
    this.router.navigate(['/login']);
  }
}
