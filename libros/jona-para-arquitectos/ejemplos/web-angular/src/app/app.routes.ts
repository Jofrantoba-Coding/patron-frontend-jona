import { Component, inject } from '@angular/core';
import { ActivatedRoute, type Routes } from '@angular/router';
import { UiLoginImplComponent } from './uilogin/ui-login-impl.component';

@Component({ selector: 'app-placeholder', template: '<h1>{{ title }}</h1>' })
class PlaceholderComponent {
  readonly title: string = inject(ActivatedRoute).snapshot.data['title'] ?? 'Sesión iniciada';
}

// El enrutador registra la unidad por su entrada, UiLoginImplComponent (N4).
export const routes: Routes = [
  { path: '', component: UiLoginImplComponent },
  { path: 'inicio', component: PlaceholderComponent },
  { path: 'crear-cuenta', component: PlaceholderComponent, data: { title: 'Crear cuenta' } },
  { path: 'recuperar-clave', component: PlaceholderComponent, data: { title: 'Recuperar contraseña' } },
];
