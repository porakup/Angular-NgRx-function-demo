import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppSharedComponent } from '../app/app.shared.component'

import { LoginComponent } from '../views/login/login.component';
import { RouteGuard } from './route.guard';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    ReactiveFormsModule,
    AppSharedComponent,
    RouterModule.forChild([{ path: '', component: LoginComponent, canActivate: [RouteGuard], data: { auth: true } }])
  ]
})
export class LoginRouter {}
