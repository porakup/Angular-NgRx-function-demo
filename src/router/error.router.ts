import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorComponent } from '../views/error/error.component';
import { RouteGuard } from './route.guard';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: ErrorComponent, canActivate: [RouteGuard]}]),
  ]
})
export class ErrorRouter {}
