import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSharedComponent } from '../app/app.shared.component'

import { VideoComponent } from '../views/video/video.component';
import { RouteGuard } from './route.guard';

@NgModule({
  declarations: [VideoComponent],
  imports: [
    AppSharedComponent,
    RouterModule.forChild([{ path: '', component: VideoComponent, canActivate: [RouteGuard]}]),
  ]
})
export class VideoRouter {}
