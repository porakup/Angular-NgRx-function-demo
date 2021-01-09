import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '../components/layouts/core/core.component';
import { HeaderComponent } from '../components/layouts/header/header.component'
import { FooterComponent } from '../components/layouts/footer/footer.component'
import { AppSharedComponent } from '../app/app.shared.component'

const routes: Routes = [
    {
      path: '',
      component: CoreComponent,
      children: [
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'user/:username', loadChildren: () => import('../router/user.router').then(r => r.UserRouter) },
        { path: 'video/:videoId', loadChildren: () => import('../router/video.router').then(r => r.VideoRouter) },
        { path: 'search', loadChildren: () => import('../router/search.router').then(r => r.SearchRouter) },
        { path: '404', loadChildren: () => import('../router/error.router').then(r => r.ErrorRouter) },
      ]
    }
  ];

@NgModule({
  declarations: [
      CoreComponent,
      HeaderComponent,
      FooterComponent,
    ],
  imports: [
    AppSharedComponent,
    RouterModule.forChild(routes)
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CoreRouter {}
