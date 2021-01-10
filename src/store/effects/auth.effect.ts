import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import * as AuthAction from '../actions/auth.action';
import { AuthService } from '../../services/auth.service';
import * as RequestAction from '../../store/actions/request.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';


@Injectable()
export class AuthEffect {

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
    private store: Store<AppState>,
  ) {}

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.LoginAction),
    switchMap((action) => {
      return this.authService.login({username: action.username, password: action.password})
        .pipe(
          map(resp => {
            localStorage.setItem('user', JSON.stringify(resp));
            return AuthAction.SetLoginAction(resp);
          }),
          catchError(err => {
            return throwError(err);
          })
        );
    })
    )
  );


  setLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.SetLoginAction),
      tap((action) => {
        if (action.isLoggedIn) {
          this.store.dispatch(RequestAction.ClearLoginMessageAction());
          this.router.navigateByUrl(`/user/${action.username}`);
        }
      })
    ), { dispatch: false }
  );


  checkAuth = createEffect(() =>
  this.actions$.pipe(
      ofType(AuthAction.CheckAuthAction),
        map((action) => {
          if (action.isLoggedIn) {
            return AuthAction.SetAuthAction(action);
          }else {
            return AuthAction.LogoutAction();
          }
      })
    )
  );


  logout = createEffect(() =>
  this.actions$.pipe(
      ofType(AuthAction.LogoutAction),
      tap(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('/login');
      })
    ), { dispatch: false }
  );

}
