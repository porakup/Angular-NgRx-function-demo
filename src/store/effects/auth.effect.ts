import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
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

  @Effect()
  login = this.actions$.pipe(
    ofType(AuthAction.LOGIN),
    switchMap((action: AuthAction.LoginAction) => {
      return this.authService.login({username: action.payload.username, password: action.payload.password})
        .pipe(
          map(resp => {
            localStorage.setItem('user', JSON.stringify(resp));
            return new AuthAction.SetLoginAction(resp);
          }),
          catchError(err => {
            return throwError(err);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  setLogin= this.actions$.pipe(
    ofType(AuthAction.SET_LOGIN),
    tap((action: AuthAction.SetLoginAction) => {
      if (action.payload.isLoggedIn) {
        this.store.dispatch(new RequestAction.ClearLoginMessageAction());
        this.router.navigateByUrl(`/user/${action.payload.username}`);
      }
    })
  );


  @Effect()
  checkAuth = this.actions$.pipe(
    ofType(AuthAction.CHECK_AUTH),
    map((action: AuthAction.CheckAuthAction) => {
        if (action.payload.isLoggedIn) {
          return new AuthAction.SetAuthAction(action.payload);
        }else {
          return new AuthAction.LogoutAction();
        }
    })
  );


  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthAction.LOGOUT),
    tap(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    })
  );

}
