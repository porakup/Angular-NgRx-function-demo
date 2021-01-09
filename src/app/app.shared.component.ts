import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { InputSearchComponent } from '../components/input/input-search/input-search.component';
import { CommonModule } from '@angular/common';
import DatePipe from '../pipes/date.pipe';
import TimePipe from '../pipes/time.pipe';

@NgModule({
  declarations: [
     InputSearchComponent,
     DatePipe,
     TimePipe
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    InputSearchComponent,
    DatePipe,
    TimePipe
  ],
  entryComponents: [
  ],
  providers: []
})
export class AppSharedComponent {}
