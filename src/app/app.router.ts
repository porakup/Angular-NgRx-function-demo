import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('../router/core.router').then(r => r.CoreRouter) },
  { path: 'login', loadChildren: () => import('../router/login.router').then(r => r.LoginRouter) },
  { path: '**', redirectTo: '/404'}
];

export const appRouting = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRouter {}
