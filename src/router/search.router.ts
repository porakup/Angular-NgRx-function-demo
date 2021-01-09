import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSharedComponent } from '../app/app.shared.component'

import { SearchComponent } from '../views/search/search.component';
import { RouteGuard } from './route.guard';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    AppSharedComponent,
    RouterModule.forChild([{ path: '', component: SearchComponent, canActivate: [RouteGuard] }])
  ]
})
export class SearchRouter {}
