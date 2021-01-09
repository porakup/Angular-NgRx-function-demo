import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRouter } from './app.router';
import { AppProvider } from './app.provider';
import { AppSharedComponent } from './app.shared.component'

import { AuthEffect } from '../store/effects/auth.effect';
import { SearchEffect } from '../store/effects/search.effect';
import {appReducer}  from './app.reducer';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouter,
    AppProvider,
    AppSharedComponent,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffect, SearchEffect]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    NgxSpinnerModule,
    NoopAnimationsModule
    // StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
