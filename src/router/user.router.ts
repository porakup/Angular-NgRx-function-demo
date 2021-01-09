import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSharedComponent } from '../app/app.shared.component'

import { UserComponent } from '../views/user/user.component';
import { RouteGuard } from './route.guard';

@NgModule({
  declarations: [UserComponent],
  imports: [
    AppSharedComponent,
    RouterModule.forChild([{ path: '', component: UserComponent, canActivate: [RouteGuard]}])
  ]
})
export class UserRouter {}
