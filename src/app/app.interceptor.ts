
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Auth from 'src/models/auth.model';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import * as RequestAction from '../store/actions/request.action';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private router: Router, private store: Store<AppState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let user: Auth = JSON.parse(localStorage.getItem('user'));
    
    if(user && user.accessToken){
      request = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${user.accessToken}`)
      });
    }  

    request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    
    return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
            return event;
        }),
        catchError((error: HttpErrorResponse) => {
          this.store.dispatch(new RequestAction.ClearRequestAction());
          if (error instanceof HttpErrorResponse && error.status === 401) {
            let message = error.error.message
            this.store.dispatch(new RequestAction.SetLoginMessageAction({message}));
            localStorage.removeItem('user');
            this.router.navigateByUrl('/log-in');
          }else if (error instanceof HttpErrorResponse) {
            let message = error.error.message
            if(message) {
              this.store.dispatch(new RequestAction.SetMessageAction({message}));
            }
          }
          return throwError(error);
        })
    );

    }
}