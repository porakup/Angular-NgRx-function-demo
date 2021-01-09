import { Action } from '@ngrx/store';
import { AuthState } from '../states/auth.state';

export const LOGIN = '[Auth] Login';
export const SET_LOGIN = '[Auth] Set Login';
export const CHECK_AUTH = '[Auth] Check Auth';
export const SET_AUTH = '[Auth] Set Auth';
export const LOGOUT = '[Auth] Logout';


export class LoginAction implements Action {
    readonly type = LOGIN;

    constructor(public payload: {username: string, password: string}) {}
}

export class SetLoginAction implements Action {
    readonly type = SET_LOGIN;
  
    constructor(public payload: AuthState) {}
}

export class CheckAuthAction implements Action {
    readonly type = CHECK_AUTH;
  
    constructor(public payload: AuthState) {}
}

export class SetAuthAction implements Action {
    readonly type = SET_AUTH;
  
    constructor(public payload: AuthState) {}
}

export class LogoutAction implements Action {
    readonly type = LOGOUT;
}

export type AuthAction =
  | LoginAction
  | SetLoginAction
  | CheckAuthAction
  | SetAuthAction
  | LogoutAction

  

