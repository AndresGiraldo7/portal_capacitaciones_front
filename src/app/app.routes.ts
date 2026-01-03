import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/home/home').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'cursos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./cursos/lista-modulos/lista-modulos').then((m) => m.ListaModulosComponent),
      },
      {
        path: ':idModulo',
        loadComponent: () =>
          import('./cursos/lista-cursos/lista-cursos').then((m) => m.ListaCursosComponent),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/mi-perfil/mi-perfil').then((m) => m.MiPerfilComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-cursos/admin-cursos').then((m) => m.AdminCursosComponent),
    canActivate: [AuthGuard],
    data: { rol: 'ADMIN' },
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
